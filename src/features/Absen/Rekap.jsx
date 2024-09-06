import React, { useState, useEffect } from "react";
import Api from "../../api";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import hasAnyPermission from "../../utils/Permissions";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for marker icons not appearing
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const AttendanceSummary = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [photoTab, setPhotoTab] = useState("check-in");
  const [mapTab, setMapTab] = useState("check-in");

  const token = Cookies.get("token");
  const role = JSON.parse(Cookies.get("user")).roles;
  const recordsPerPage = 10;

  const normalizeData = (data) => {
    return Object.values(data).map((day) => {
      const checkInData = day.entries["Masuk"]?.entries[0] || {};
      const checkOutData = day.entries["Pulang"]?.entries[0] || {};

      return {
        date: day.date,
        name: checkInData.users?.name || "-",
        statusMasuk: checkInData.status || "-",
        statusPulang: checkOutData.status || "-",
        arrivalTime: checkInData.departureTime || "Belum Absen Masuk",
        departureTime: checkOutData.departureTime || "Belum Absen Keluar",
        arrivalImage: checkInData.image || "",
        departureImage: checkOutData.image || "",
        latitudeMasuk: checkInData.latitude || null,
        longitudeMasuk: checkInData.longitude || null,
        latitudePulang: checkOutData.latitude || null,
        longitudePulang: checkOutData.longitude || null,
        status: checkInData.absenceReason || null
      };
    });
  };

  const getAttendanceRecords = async (page) => {
    try {
      let endpoint = "";

      if (role === "siswa") {
        endpoint = `/admin/absenSiswaOnly?page=${page}&limit=${recordsPerPage}`;
      } else if (role === "guru" || role === "orang tua") {
        endpoint = `/admin/absenSiswa?page=${page}&limit=${recordsPerPage}`;
      } else {
        endpoint = `/admin/absence?page=${page}&limit=${recordsPerPage}`;
      }

      const response = await Api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response?.data?.data || [];

      if (typeof data === "object") {
        const normalizedData = normalizeData(data);
        setAttendanceRecords(normalizedData);
      } else {
        setAttendanceRecords([]);
      }

      setTotalPages(response?.data?.totalPages || 1);
      setPaginationLinks(response?.data?.links || []);
    } catch (error) {
      toast.error("Failed to fetch attendance records");
    }
  };

  useEffect(() => {
    getAttendanceRecords(currentPage);
  }, [currentPage]);

  const handlePageChange = (url) => {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const page = urlParams.get("page");

    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  };

  // Component to adjust map view
  const MapViewUpdater = ({ position }) => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.setView(position, 13); // Adjust zoom level if needed
      }
    }, [position, map]);

    return null;
  };

  return (
    <div className="container mx-auto mt-5 px-4 md:mt-10 md:px-8 mb-[400px]">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-3xl">
        Rekap Absensi
      </h1>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-300 dark:text-white dark:bg-[#1c2229]">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border-b">No</th>
              <th className="py-2 px-4 border-b">Tanggal</th>
              <th className="py-2 px-4 border-b">Nama</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Waktu</th>
              <th className="py-2 px-4 border-b">Photo</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-center">
                    {(currentPage - 1) * recordsPerPage + index + 1}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record.date}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record.name}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record.status}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    Masuk: {record.arrivalTime}
                    <br />
                    Pulang: {record.departureTime}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <img
                      src={record.arrivalImage || record.departureImage}
                      alt="Attendance"
                      className="w-12 h-12 object-cover mx-auto cursor-pointer rounded-full md:w-20 md:h-20"
                      onClick={() => {
                        setSelectedRecord(record);
                        document.getElementById("my_modal_3").showModal();
                      }}
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      className="btn btn-primary btn-sm pl-2"
                      onClick={() => {
                        setSelectedRecord(record);
                        document.getElementById("my_modal_maps").showModal();
                      }}
                    >
                      Lihat Posisi
                    </button>
                    {hasAnyPermission(["siswa.delete"]) && (
                      <button className="btn btn-primary btn-sm ml-2">
                        Verifikasi
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-2 px-4 text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Image Modal */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-2">Absensi</h3>
            <div className="tabs">
              <a
                className={`tab tab-lifted ${
                  photoTab === "check-in" ? "tab-active" : ""
                }`}
                onClick={() => setPhotoTab("check-in")}
              >
                Foto Masuk
              </a>
              <a
                className={`tab tab-lifted ${
                  photoTab === "check-out" ? "tab-active" : ""
                }`}
                onClick={() => setPhotoTab("check-out")}
              >
                Foto Pulang
              </a>
            </div>
            <div className="mt-4">
              <img
                src={
                  photoTab === "check-in"
                    ? selectedRecord?.arrivalImage
                    : selectedRecord?.departureImage
                }
                alt="Attendance"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </dialog>

        {/* Map Modal */}
        <dialog id="my_modal_maps" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-2">Lokasi Absen</h3>
            <div className="tabs">
              <a
                className={`tab tab-lifted ${
                  mapTab === "check-in" ? "tab-active" : ""
                }`}
                onClick={() => setMapTab("check-in")}
              >
                Masuk
              </a>
              <a
                className={`tab tab-lifted ${
                  mapTab === "check-out" ? "tab-active" : ""
                }`}
                onClick={() => setMapTab("check-out")}
              >
                Pulang
              </a>
            </div>
            <div className="w-full h-80">
              <MapContainer center={[0, 0]} zoom={13} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapViewUpdater
                  position={
                    mapTab === "check-in"
                      ? [
                          selectedRecord?.latitudeMasuk || 0,
                          selectedRecord?.longitudeMasuk || 0
                        ]
                      : [
                          selectedRecord?.latitudePulang || 0,
                          selectedRecord?.longitudePulang || 0
                        ]
                  }
                />
                {mapTab === "check-in" &&
                  selectedRecord?.latitudeMasuk &&
                  selectedRecord?.longitudeMasuk && (
                    <Marker
                      position={[
                        selectedRecord.latitudeMasuk,
                        selectedRecord.longitudeMasuk
                      ]}
                    >
                      <Popup>Check-in: {selectedRecord.arrivalTime}</Popup>
                    </Marker>
                  )}
                {mapTab === "check-out" &&
                  selectedRecord?.latitudePulang &&
                  selectedRecord?.longitudePulang && (
                    <Marker
                      position={[
                        selectedRecord.latitudePulang,
                        selectedRecord.longitudePulang
                      ]}
                    >
                      <Popup>Check-out: {selectedRecord.departureTime}</Popup>
                    </Marker>
                  )}
              </MapContainer>
            </div>
          </div>
        </dialog>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          className="btn btn-primary btn-sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(paginationLinks.prev)}
        >
          Previous
        </button>
        <button
          className="btn btn-primary btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(paginationLinks.next)}
        >
          Next
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AttendanceSummary;
