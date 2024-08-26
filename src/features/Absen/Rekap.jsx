import React, { useState, useEffect } from "react";
import Api from "../../api";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import hasAnyPermission from "../../utils/Permissions";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const AttendanceSummary = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = Cookies.get("token");
  const recordsPerPage = 10; 
  const [paginationLinks, setPaginationLinks] = useState([]);
  

const getAttendanceRecords = async (page) => {
  try {
    const response = await Api.get(`/admin/absence?page=${page}&limit=${recordsPerPage}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Response data:", response.data);

    setAttendanceRecords(response.data.data.data);
    setTotalPages(response.data.data.totalPages || 1); // Set total pages or fallback to 1
    setPaginationLinks(response.data.data.links || []); // Store pagination links

  } catch (error) {
    console.error("Error fetching attendance records:", error.message);
    toast.error("Failed to fetch attendance records");
  }
};

  useEffect(() => {
    getAttendanceRecords(currentPage);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (url) => {
    // Extract the page number from the URL
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const page = urlParams.get('page');
    
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
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
              <th className="py-2 px-4 border-b">Nama</th>
              <th className="py-2 px-4 border-b">Kelas</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Waktu Masuk</th>
              <th className="py-2 px-4 border-b">Waktu Keluar</th>
              <th className="py-2 px-4 border-b">Photo</th>
             <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-center">{(currentPage - 1) * recordsPerPage + index + 1}</td>
                  <td className="py-2 px-4 border-b text-center">{record.users ? record.users.name : "-"}</td>
                  <td className="py-2 px-4 border-b text-center">{record.users ? record.claa : "-"}</td>
                  <td className="py-2 px-4 border-b text-center">{record.absenceReason}</td>
                  <td className="py-2 px-4 border-b text-center">{record.departureTime}</td>
                  <td className="py-2 px-4 border-b text-center"> 
                    {record.arrivalTime ? (
                      <p> {record.arrivalTime}</p>
                    ) : (
                      <p>Belum Absen Keluar</p>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <img
                      src={`${record.image}`}
                      alt="Attendance"
                      className="w-12 h-12 object-cover mx-auto cursor-pointer rounded-full md:w-20 md:h-20"
                      onClick={() => {
                        setSelectedRecord(record);
                        document.getElementById("my_modal_3").showModal();
                      }}
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center ">
                    <button 
                      className="btn btn-primary btn-sm pl-2" 
                      onClick={() => {
                        setSelectedRecord(record);
                        document.getElementById("my_modal_maps").showModal();
                      }}>
                        Lihat Posisi
                    </button>
                    {hasAnyPermission(["siswa.delete"]) && (
                      <button className="btn btn-primary btn-sm ml-2">Verifikasi</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-2 px-4 text-center">No records found</td>
              </tr>
            )}
          </tbody>
        </table>

 



        {/* Image Modal */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg mb-4">Expend Photo</h3>
            {selectedRecord && selectedRecord.image ? (
              <img
                src={`${selectedRecord.image}`}
                alt="Attendance"
                className="rounded-lg w-full h-full object-cover"
              />
            ) : (
              <p>Gambar tidak tersedia</p>
            )}
          </div>
        </dialog>

        {/* Map Modal */}
        <dialog id="my_modal_maps" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg mb-4">Lokasi Absen</h3>
            {selectedRecord && selectedRecord.latitude && selectedRecord.longitude ? (
              <MapContainer center={[selectedRecord.latitude, selectedRecord.longitude]} zoom={13} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[selectedRecord.latitude, selectedRecord.longitude]}>
                  <Popup>
                    Lokasi Absen
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p>Lokasi tidak tersedia</p>
            )}
          </div>
        </dialog>
      </div>

      <div className="flex justify-center mt-4">
  {paginationLinks.map((link, index) => (
    <button
      key={index}
      className={`btn btn-sm mx-1 ${link.active ? 'btn-primary' : ''}`}
      onClick={() => link.url && handlePageChange(link.url)}
      disabled={!link.url}
    >
      {link.label.replace(/&laquo;|&raquo;/g, '').trim()}
    </button>
  ))}
</div>

      <ToastContainer />
    </div>
  );
};

export default AttendanceSummary;
