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
  const [sortOrder, setSortOrder] = useState("asc"); // Default to ascending



  const token = Cookies.get("token");
  const role = JSON.parse(Cookies.get("user")).roles;
  const recordsPerPage = 10;

  const sortAttendanceRecords = (records) => {
    return records.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA; // Ascending or Descending
    });
  };
  

  const normalizeData = (data) => {
    return Object.values(data).map((day) => {
      const checkInData = day.entries["Masuk"]?.entries[0] || {};
      const checkOutData = day.entries["Pulang"]?.entries[0] || {};

      return {
        date: day.date
          ? `${
              ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"][
                new Date(day.date).getDay()
              ] || ""
            }, ${day.date}`
          : "-",
        name:
          checkInData.users.students?.name || checkInData.users?.name || "-",
        statusMasuk: checkInData.status || "-",
        statusPulang: checkOutData.status || "-",
        arrivalTime: checkInData.departureTime
          ? checkInData.departureTime + " WIB"
          : "Belum Absen Masuk",
        departureTime: checkOutData.departureTime
          ? checkOutData.departureTime + " WIB"
          : "Belum Absen Keluar",
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

  const getAttendanceRecords = async () => {
    try {
      let endpoint = "";

      if (role === "siswa") {
        endpoint = `/admin/absenSiswaOnly`;
      } else if (role === "guru" || role === "orang tua" || role === "industri") {
        endpoint = `/admin/absenSiswa`;
      } else {
        endpoint = `/admin/absence`;
      }

      const response = await Api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data?.data || [];
      if (typeof data === "object") {
        const normalizedData = normalizeData(data);
        setAttendanceRecords(normalizedData);
        setTotalPages(Math.ceil(normalizedData.length / recordsPerPage));
      } else {
        setAttendanceRecords([]);
      }
    } catch (error) {
      toast.error("Failed to fetch attendance records");
    }
  };

  useEffect(() => {
    getAttendanceRecords();
  }, []);


  

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedRecords = attendanceRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

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
    <div className="container mx-auto mt-5 px-4   mb-[400px]">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-3xl">
        Rekap Absensi 
      </h1>
      <div className="flex justify-end px-4 items-center mb-4">
  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mr-4">
    Urutkan Berdasarkan:
  </h3>
  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    className="border border-gray-300 rounded p-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    <option value="asc">Urutkan Terbaru ^</option>
    <option value="desc">Urutkan Terlama v</option>
  </select>
</div>



      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-300 dark:text-white dark:bg-[#1c2229]">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-4 px-6 border-b text-center">No</th>
              <th className="py-4 px-6 border-b text-center">Tanggal</th>
              <th className="py-4 px-6 border-b text-center">Nama</th>
              <th className="py-4 px-6 border-b text-center">Status</th>
              <th className="py-4 px-6 border-b text-center">Waktu Masuk</th>
              <th className="py-4 px-6 border-b text-center">Waktu Keluar</th>
              <th className="py-4 px-6 border-b text-center">Photo</th>
              <th className="py-4 px-6 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
          {sortAttendanceRecords(paginatedRecords).length > 0 ? (
              paginatedRecords.map((record, index) => (
                <tr key={index} className="h-20">
                  <td className="py-4 px-6 border-b text-center">
                    {(currentPage - 1) * recordsPerPage + index + 1}
                  </td>
                  <td className="md:py-4 md:px-6 border-b text-center whitespace-normal break-words ">
                    {record.date}
                  </td>
                  <td className="py-4 px-6 border-b text-center whitespace-normal break-words">
                    {record.name}
                  </td>
                  <td className="py-4 px-6 border-b text-center whitespace-normal break-words">
                    {record.status}
                  </td>
                  <td className="py-4 px-6 border-b text-center whitespace-normal break-words">
                    {record.arrivalTime}
                  </td>
                  <td className="py-4 px-6 border-b text-center whitespace-normal break-words">
                    {record.departureTime}
                  </td>
                  <td className="py-4 px-6 border-b text-center whitespace-normal break-words">
                    <img
                      src={record.arrivalImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                      alt="Attendance"
                      className="w-16 h-16 object-cover mx-auto cursor-pointer rounded-full"
                      onClick={() => {
                        setSelectedRecord(record);
                        document.getElementById("my_modal_3").showModal();
                      }}
                    />
                  </td>
                  <td className="py-4 px-6 border-b text-center whitespace-normal break-words">
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
                      <button className="btn bg-green-500 btn-sm md:ml-2 mt-2">
                        Verifikasi
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 px-6 text-center">
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
             {/* Tab navigasi untuk Absensi */}
        <div className="tabs">
          <a
            className={`tab tab-lifted ${
              mapTab === "check-in"
                ? "tab-active border-b-2 border-blue-500"
                : ""
            }`}
            onClick={() => {
              setMapTab("check-in");
              setPhotoTab("check-in");
            }}
          >
            Masuk
          </a>
          <a
            className={`tab tab-lifted ${
              mapTab === "check-out"
                ? "tab-active border-b-2 border-blue-500"
                : ""
            }`}
            onClick={() => {
              setMapTab("check-out");
              setPhotoTab("check-out");
            }}
          >
            Pulang
          </a>
        </div>
            <div className="mt-4">
              {photoTab === "check-out" && !selectedRecord?.departureImage ? (
                <p className="text-red-500">Belum Absen Pulang</p>
              ) : (
                <img
                  src={
                    photoTab === "check-in"
                      ? selectedRecord?.arrivalImage
                      : selectedRecord?.departureImage
                  }
                  alt="Attendance"
                  className="w-full h-auto object-cover"
                />
              )}
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
                  mapTab === "check-in"
                    ? "tab-active border-b-2 border-blue-500"
                    : ""
                }`}
                onClick={() => setMapTab("check-in")}
              >
                Masuk
              </a>
              <a
                className={`tab tab-lifted ${
                  mapTab === "check-out"
                    ? "tab-active border-b-2 border-blue-500"
                    : ""
                }`}
                onClick={() => setMapTab("check-out")}
              >
                Pulang
              </a>
            </div>

            <div className="w-full h-80">
              {mapTab === "check-out" &&
              (!selectedRecord?.latitudePulang ||
                !selectedRecord?.longitudePulang) ? (
                <p className="text-red-500 font-bold text-center mt-8">
                  Anda belum absen pulang, peta tidak dapat ditampilkan.
                </p>
              ) : (
                <iframe
                  src={
                    mapTab === "check-in"
                      ? `https://www.google.com/maps?q=${selectedRecord?.latitudeMasuk},${selectedRecord?.longitudeMasuk}&output=embed`
                      : `https://www.google.com/maps?q=${selectedRecord?.latitudePulang},${selectedRecord?.longitudePulang}&output=embed`
                  }
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
                ></iframe>
              )}
            </div>
          </div>
        </dialog>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          className="btn btn-primary btn-sm mr-2"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary btn-sm ml-2"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>


      <ToastContainer />
    </div>
  );
};

export default AttendanceSummary;
