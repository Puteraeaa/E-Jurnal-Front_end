import React, { useState, useEffect } from "react";
import Api from "../../api";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import hasAnyPermission from "../../utils/Permissions";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';


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
  const [sortOrder, setSortOrder] = useState("asc");
  const [paginatedRecords, setPaginatedRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({});

  

  const token = Cookies.get("token");
  const role = JSON.parse(Cookies.get("user")).roles;
  const recordsPerPage = 20;

  const sortAttendanceRecords = (records) => {
    return records.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA; // Ascending or Descending
    });
  };

  

  const normalizeData = (data) => {
    return Object.values(data).map((day) => {
      const checkInData = day.entries?.["Masuk"]?.entries?.[0] || {};
      const checkOutData = day.entries?.["Pulang"]?.entries?.[0] || {};
      const formattedDate = day.date
        ? `${new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(
            new Date(day.date)
          )}, ${new Date(day.date).toLocaleDateString("id-ID")}`
        : "-";
  
      return {
        id: checkInData.id || checkOutData.id || "-",
        date: formattedDate,
        name: checkInData.users?.students?.name || checkOutData.users?.students?.name || checkInData.users?.name || checkOutData.users?.name || "-",
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
        status: checkInData.absenceReason || checkOutData.absenceReason || null,
        verified: checkInData.verified || checkOutData.verified || false,
        kelas: checkInData.users?.students?.classes?.name || checkOutData.users?.students?.classes?.name || null, // Validasi `students` sebelum mengakses `classes`
      };
    });
  };

  



  const getAttendanceRecords = async () => {
    setLoading(true);
    try {
      let endpoint = "";

      if (role === "siswa") {
        endpoint = `/admin/absenSiswaOnly`;
      } else if (
        role === "guru" ||
        role === "orang tua" ||
        role === "industri"
      ) {
        endpoint = `/admin/absenSiswa`;
      } else {
        endpoint = `/admin/absence`;
      }

      const response = await Api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { date: selectedDate, search: searchTerm , page: currentPage,} // Tambahkan parameter tanggal
      });

      setPagination({
        currentPage: response.data.data.current_page,
        perPage: response.data.data.per_page,
        total: response.data.data.total,
      });

      console.log("Pagination:", response.data.data.data);

     

      const data = response.data.data.data || [];
      console.log("Data:", data);
      if (typeof data === "object") {
        const normalizedData = normalizeData(data);
        console.log("Normalized Data:", normalizedData);
        const sortedData = sortAttendanceRecords(normalizedData); // Tambahkan ini
        setAttendanceRecords(sortedData); // Simpan data yang sudah diurutkan
        setTotalPages(Math.ceil(sortedData.length / recordsPerPage));
        setPaginatedRecords(sortedData.slice(0, recordsPerPage));
      } else {
        setAttendanceRecords([]);
      }
    } catch (error) {
    
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendanceRecords();
  }, [selectedDate,searchTerm, currentPage]); // Tambahkan searchTerm dan currentPage sebagai dependensi

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleVerify = (event, record) => {
    event.preventDefault(); // Mencegah halaman berpindah

    Swal.fire({
      title: "Apakah kamu yakin?",
      text: `Kamu akan memverifikasi absensi untuk ${record.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, verifikasi!",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        verifyAttendance(record.id); // Verifikasi jika dikonfirmasi
      }
    });
  };

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const renderPagination = () => {
    const pages = [];
    const totalPages = Math.ceil(pagination.total / pagination.perPage);

    pages.push(
      <button
        key={1}
        className={`join-item btn ${pagination.currentPage === 1 ? "btn-active" : ""
          }`}
        onClick={() => handleClick(1)}
      >
        1
      </button>
    );

    if (pagination.currentPage > 3) {
      pages.push(
        <button key="prev-ellipsis" className="join-item btn btn-disabled">
          ...
        </button>
      );
    }

    const startPage = Math.max(2, pagination.currentPage - 1);
    const endPage = Math.min(totalPages - 1, pagination.currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`join-item btn ${pagination.currentPage === i ? "btn-active" : ""
            }`}
          onClick={() => handleClick(i)}
        >
          {i}
        </button>
      );
    }

    if (pagination.currentPage < totalPages - 2) {
      pages.push(
        <button key="next-ellipsis" className="join-item btn btn-disabled">
          ...
        </button>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`join-item btn ${pagination.currentPage === totalPages ? "btn-active" : ""
            }`}
          onClick={() => handleClick(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return <>{pages}</>;
  };

  const verifyAttendance = async (absenId) => {
    try {
      const response = await Api.patch(
        `/admin/absence/${absenId}`,
        {
          verified: "done" // Mengirim data verifikasi
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Absensi berhasil diverifikasi.", {
        position: "top-right",
        duration: 4000
      });

      getAttendanceRecords(); // Refresh records tanpa berpindah halaman
          
    } catch (error) {
      console.error(error.response);
      Swal.fire("Gagal!", "Terjadi kesalahan saat memverifikasi.", "error");
    }
  };

  const refreshAttendanceRecords = async () => {
    try {
      let endpoint = "";
      if (role === "siswa") {
        endpoint = `/admin/absenSiswaOnly`;
      } else if (
        role === "guru" ||
        role === "orang tua" ||
        role === "industri"
      ) {
        endpoint = `/admin/absenSiswa`;
      } else {
        endpoint = `/admin/absence`;
      }

      const response = await Api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response?.data?.data || [];
      if (typeof data === "object") {
        const normalizedData = normalizeData(data);
        const sortedData = sortAttendanceRecords(normalizedData); // Urutkan data baru
        setAttendanceRecords(sortedData);
        setPaginatedRecords(sortedData.slice(0, recordsPerPage)); // Perbarui state paginatedRecords
        setTotalPages(Math.ceil(sortedData.length / recordsPerPage)); // Update total pages
      } else {
        setAttendanceRecords([]);
      }
    } catch (error) {
      toast.error("Failed to fetch attendance records", error);
      
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
    <div className="container mx-auto mt-5 px-4   mb-[400px]">
      <div className="bg-white dark:bg-[#1c2229] shadow-md rounded-lg p-6 mb-6">
        <div className=" mt-[-9px] flex">
       
          <button
            onClick={() => window.history.back()} // Kembali ke halaman sebelumnya
            className="bg-blue-600 text-white font-semibold py-1 md:py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ease-in-out flex items-center text-sm md:text-base "
          >
            <i className="fa-solid fa-backward fa-[10px] mr-1 "></i>
          </button>
        </div>
        <p className="border-b pb-2 font-bold text-xl md:text-4xl text-center">
          <i className="fas fa-chart-pie dark:text-white text-blue-600"></i>{" "}
          Data Absen Harian
        </p>
        <p className="text-gray-600 font-semibold mt-2 dark:text-white text-center text-xs md:text-base">
          Ini adalah data absen harian untuk Siswa Masuk atau Siswa Pulang PKL.
          <span className="font-bold"></span>
        </p>
      </div>
      {hasAnyPermission([`users.create`, `guru.index`]) && (
      <div className="flex justify-between px-4 mb-4 sm:flex-row flex-col sm:space-x-4 space-y-4 sm:space-y-0">
       
       
    
      {/* Search input */}
   
        <input
          type="text"
          placeholder="Cari nama siswa..."
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 rounded p-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 sm:w-auto w-full"
        />

<div className="flex items-center sm:w-auto w-full">
            <h3 className="md:text-lg text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2">
            Berdasarkan Tanggal:
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded p-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
            />
          </div>
     
      </div>
    )}
          
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
            />
          </svg>
        </div>
      ) : (
        <div className="relative w-full">
        {/* Scroll cue gradient */}
       
  
        {/* Scrollable Table Container */}
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 scroll-smooth">
        <div className="absolute left-0 top-0 h-full w-5 bg-gradient-to-r from-white dark:from-[#1c2229] z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-5 bg-gradient-to-l from-white dark:from-[#1c2229] z-10 pointer-events-none" />
          <table className="min-w-full bg-white border border-gray-300 dark:text-white dark:bg-[#1c2229]">
            <thead>
              <tr className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <th className="py-4 px-6 border-b text-center sticky top-0 z-10 bg-inherit">No</th>
                <th className="py-4 px-6 border-b text-center sticky top-0 z-10 bg-inherit">Tanggal</th>
                <th className="py-4 px-6 border-b text-center sticky top-0 z-10 bg-inherit">Nama</th>
                <th className="py-4 px-6 border-b text-center sticky top-0 z-10 bg-inherit">Kelas</th>
                <th className="py-4 px-6 border-b text-center sticky top-0 z-10 bg-inherit">Status</th>
                <th className="py-4 px-6 border-b text-center sticky top-0 z-10 bg-inherit hidden sm:table-cell">Waktu Masuk</th>
                <th className="py-4 px-6 border-b text-center sticky top-0 z-10 bg-inherit hidden sm:table-cell">Waktu Keluar</th>
                <th className="py-4 px-6 border-b text-center sticky top-0 z-10 bg-inherit">Verified</th>
                <th className="py-4 px-6 border-b text-center sticky top-0 z-10 bg-inherit">Photo</th>
                <th className="py-4 px-6 border-b text-center sticky top-0 z-10 bg-inherit">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortAttendanceRecords(paginatedRecords).length > 0 ? (
                paginatedRecords.map((record, index) => (
                  <tr key={index} className="h-20">
                    <td className="py-4 px-6 border-b text-center">
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="py-4 px-6 border-b text-center break-words">
                      {record.date}
                    </td>
                    <td className="py-4 px-6 border-b text-center break-words">
                      {record.name}
                    </td>
                    <td className="py-4 px-6 border-b text-center break-words">
                      {record.kelas}
                    </td>
                    <td className="py-4 px-6 border-b text-center break-words">
                      {record.statusMasuk} / {record.statusPulang}
                    </td>
                    <td className="py-4 px-6 border-b text-center break-words hidden sm:table-cell">
                      {record.arrivalTime}
                    </td>
                    <td className="py-4 px-6 border-b text-center break-words hidden sm:table-cell">
                      {record.departureTime}
                    </td>
                    <td className="py-4 px-6 border-b text-center">
                      <span
                        data-tooltip-id={`tooltip-${record.id}`}
                        data-tooltip-content={
                          record.verified
                            ? "Absensi telah diverifikasi oleh pihak industri"
                            : "Belum diverifikasi oleh pihak industri"
                        }
                        className={`cursor-pointer ${
                          record.verified ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {record.verified ? "✅" : "⛔"}
                      </span>
                      <Tooltip
                        id={`tooltip-${record.id}`}
                        place="top"
                        effect="solid"
                      />
                    </td>
                    <td className="py-4 px-6 border-b text-center">
                      <img
                        src={
                          record.arrivalImage ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        alt="Attendance"
                        className="w-16 h-16 object-cover mx-auto cursor-pointer rounded-full"
                        onClick={() => {
                          setSelectedRecord(record);
                          document.getElementById("my_modal_3").showModal();
                        }}
                      />
                    </td>
                    <td className="py-4 px-6 border-b text-center">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setSelectedRecord(record);
                          document.getElementById("my_modal_maps").showModal();
                        }}
                      >
                        Lihat Posisi
                      </button>
                      {hasAnyPermission(["tempat.index"]) && (
                        <form onSubmit={(e) => e.preventDefault()}>
                          <button
                            type="button"
                            className={`btn bg-green-500 btn-sm md:ml-2 mt-2 ${
                              record.verified ? "hidden" : ""
                            }`}
                            onClick={(e) => handleVerify(e, record)}
                          >
                            Verifikasi
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-4 px-6 text-center">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 gap-2">{renderPagination()}</div>

      <ToastContainer />
    </div>
  );
};

export default AttendanceSummary;
