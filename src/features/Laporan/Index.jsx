import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../../api"; // Adjust the path to your Api configuration
import Cookies from "js-cookie";
import hasAnyPermission from "../../utils/Permissions"; // Ensure this path is correct and the function is properly exported
import Select from "react-select";
import CryptoJS from "crypto-js";
import toast from "react-hot-toast";

function SkeletonRow() {
  return (
    <tr className="bg-gray-300 animate-pulse">
      <td className="p-4">
        <div className="bg-gray-400 h-6 w-32 rounded"></div>
      </td>
      <td className="p-4">
        <div className="bg-gray-400 h-4 w-24 rounded"></div>
      </td>
      <td className="p-4">
        <div className="bg-gray-400 h-4 w-24 rounded"></div>
      </td>
      <td className="p-4">
        <div className="bg-gray-400 h-4 w-32 rounded"></div>
      </td>
      <td className="p-4">
        <div className="bg-gray-400 h-4 w-32 rounded"></div>
      </td>
      <td className="p-4">
        <div className="bg-gray-400 h-4 w-32 rounded"></div>
      </td>
    </tr>
  );
}
function SkeletonCard() {
  return (
    <div className="bg-gray-300 animate-pulse p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-400 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-gray-400 rounded w-full"></div>
        <div className="h-3 bg-gray-400 rounded w-5/6"></div>
        <div className="h-3 bg-gray-400 rounded w-2/3"></div>
      </div>
    </div>
  );
}


function Index() {
  const [dataLaporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [siswa, setSiswa] = useState([]);
  const [selectedSiswaExport, setSelectedSiswaExport] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 5,
    total: 0,
  });
  const [error, setError] = useState(false);

  const [exportOption, setExportOption] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const role = JSON.parse(Cookies.get("user")).roles;
  const [siswaExport, setSiswaExport] = useState([]);
  const [loadingExport, setLoadingExport] = useState(false);



  const siswaOptionsExport = siswaExport.map((siswa) => ({
    value: siswa.user_id,
    label: siswa.name,
  }));

  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("user"));
  const navigate = useNavigate();

  const encryptId = (id) => {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();

    return encodeURIComponent(encrypted); // Encode hasil enkripsi agar valid di URL
  };

  const extractPlainText = (htmlContent) => {
    if (!htmlContent) return "";
    return htmlContent.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const exportPDF = async () => {
    // Export berdasarkan hari, bulan, dan user dengan params
    const params = new URLSearchParams();
    let fileName = "laporan-pkl";
    let fileType = "zip";

    if (exportOption === "day") params.append("day", selectedDay);
    if (exportOption === "month") {
      const monthOnly = selectedMonth.split("-")[1]; // Ambil hanya bulan
      params.append("month", monthOnly);
    }
    if (exportOption === "student") {
      params.append("user_id", selectedSiswaExport?.value);
      fileType = "pdf"; // Jika siswa dipilih, file akan menjadi PDF
    }

    setLoadingExport(true); // Set loading export ke true sebelum memulai proses
    try {
      const response = await Api.get(`admin/export-activities?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      // Buat URL dari blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}.${fileType}`); // ✅ Sesuai dengan file yang diunduh
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Data berhasil diekspor sebagai ${fileType.toUpperCase()}`);
    } catch (error) {
      console.error(`Error exporting ${fileType.toUpperCase()}:`, error);
      toast.error("Tidak Ada Data yang Dapat Diexport pada opsi ini");
    } finally {
      setLoadingExport(false);
      document.getElementById("modal_export").close(); // Set loading export ke false setelah proses selesai
    }
  };





  const fetchSiswaInExport = async () => {
    let endpoint = '';

    if (role === "orang tua" || role === "guru" || role === "industri") {
      endpoint = `admin/Studentbyrole`;
    } else {
      endpoint = `admin/student`;
    }

    try {
      const response = await Api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setSiswaExport(response.data.data.data);
      console.log("export", response.data.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSiswaInExport();
  }, []);


  const fetchData = async (search = "") => {
    const role = user.roles;

    try {
      setLoading(true);
      let response;
      const params = new URLSearchParams({
        search: search || searchTerm,
        page: currentPage,
      }).toString();

      // Fetch general data based on role or filters
      if (role === "guru" || role === "orangtua") {
        response = await Api.get(`admin/indexRole-jurnal?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (role === "siswa") {
        response = await Api.get(`admin/student-jurnal`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await Api.get(`admin/indexRole-jurnal?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const sortedData = (response.data.data.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLaporan(sortedData);

      setPagination({
        currentPage: response.data.data.current_page,
        perPage: response.data.data.per_page,
        total: response.data.data.total,
      });
      setError(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(true);
        setLaporan([]);
      } else {
        console.error("Error fetching data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500); // Add debounce to prevent spamming fetch

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout on unmount or dependency change
  }, [currentPage, searchTerm]);



  const handleRowClick = (id) => {
    navigate(`/app/detail-laporan/${id}`);
  };

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    fetchData(e.target.value);
    setCurrentPage(1);
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



  return (
    <>
      <div className="container mx-auto p-6">
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
            Jurnal Laporan Harian
          </p>
          <p className="text-gray-600 font-semibold mt-2 dark:text-white text-center text-xs md:text-base">
            Ini adalah laporan PKL yang dibuat oleh Siswa SMKN 1 Ciomas dari
            semua <span className="font-bold"></span> kejuruan.
          </p>

          {/* Tombol Back */}
        </div>

        {hasAnyPermission(["siswa.delete", "guru.index","industri.index"]) && (
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full bg-white dark:bg-[#1c2229] shadow-xl rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row items-stretch gap-4">
                {/* Input Pencarian */}
                <input
                  type="text"
                  placeholder="🔍 Cari data..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full h-10 px-4 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />

                {/* Tombol Export */}
                <button
                  onClick={() => document.getElementById("modal_export").showModal()}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 ease-in-out"
                >
                  <i className="fa-solid fa-file-pdf text-white group-hover:animate-bounce"></i>
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
          </div>

        )}



        {hasAnyPermission(["murid.index"]) && (
          <div className="card bg-yellow-500 text-white text-sm font-semibold rounded hover:bg-yellow-600 transition-colors duration-300 w-full md:w-[250px]">
            <Link
              className="block py-1 px-3 md:py-1 md:px-3 md:text-base text-center"
              to={"/app/laporan-pkl/tambah"}
            >
              <i className="fa-solid fa-file-export"></i> Add Laporan
            </Link>
          </div>
        )}



        <div className="w-full overflow-x-auto mt-6 p-3 bg-white dark:bg-gray-900 shadow-md rounded-lg hidden md:block">
          <table className="min-w-[600px] md:min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-500 dark:bg-gray-900 dark:text-white">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  No
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Nama
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tempat PKL
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Jurusan
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Deskripsi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {loading ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => <SkeletonRow key={index} />)
              ) : error ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-7 py-4 text-center text-gray-600 dark:text-white"
                  >
                    Tidak ada data laporan dengan siswa yang dipilih
                  </td>
                </tr> // Tampilkan pesan jika tidak ada data
              ) : dataLaporan.length > 0 ? (
                dataLaporan.map((record, index) => (
                  <tr
                    key={record.id}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800"
                    onClick={() => handleRowClick(encryptId(record.id))}
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 w-[200px]">
                      <div className="flex items-center">
                        <img
                          src={
                            // Jika gambar dari users students ada, gunakan itu
                            record.users?.students?.image &&
                              record.users.students.image !==
                              "https://api.jurnal.pplgsmkn1ciomas.my.id/storage"
                              ? record.users.students.image
                              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                          }
                          alt="Profile Mentor"
                          className="w-10 h-10 rounded-full border object-cover mr-3"
                        />

                        <div>
                          <div className="font-medium text-gray-900 dark:text-white w-[200px]">
                            {record.users?.students?.name || record.name}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            {record.users?.students?.classes?.name ||
                              record.className}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white w-[200px]">
                      {record.users?.students?.industries?.name ||
                        record.industry}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white w-[200px]">
                      {record.users?.students?.departements?.name ||
                        record.department}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 w-[130px]">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 truncate-multiline mb-3 w-[500px]">
                      {extractPlainText(
                        record.description || record.description
                      )?.substring(0, 100) || "-"}{record.description?.length > 100 && "..."}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-7 py-4 text-center text-gray-600 dark:text-white"
                  >
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>



        </div>
        <div className="md:hidden space-y-4 mt-10">
        {loading ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => <SkeletonCard key={index} />)
              ) : error ? (
                <p className="text-center text-gray-600 dark:text-white">Tidak ada data</p>
              ) : (
          dataLaporan.map((record) => (
            <div
              key={record.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition hover:shadow-md"
              onClick={() => handleRowClick(encryptId(record.id))}
            >
              {/* Header: Avatar & Nama */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    record.users?.students?.image &&
                      record.users.students.image !==
                      "https://api.jurnal.pplgsmkn1ciomas.my.id/storage"
                      ? record.users.students.image
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                  alt="Foto"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">
                    {record.users?.students?.name || record.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {record.users?.students?.classes?.name || record.className} | {record.users?.students?.industries?.name || record.industry}
                  </p>
                </div>
              </div>

              {/* Detail Info */}
              <div className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {extractPlainText(record.description)?.substring(0, 120) || "-"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                  🗓️ {record.date}
                </p>
              </div>
            </div>
          ))
        )}
        </div>

      </div>
      <div className="flex justify-center mt-4 gap-2">{renderPagination()}</div>



      {/* /* modal export */}

      <dialog id="modal_export" className="modal">
        <div className="modal-box p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-all">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-xl text-gray-900 dark:text-white text-center">Export Data</h3>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Export Berdasarkan
            </label>
            <select
              value={exportOption}
              onChange={(e) => setExportOption(e.target.value)}
              className="select w-full max-w-xs input-bordered h-10 mb-4 text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="">Pilih Opsi</option>
              <option value="day">Per Hari</option>
              <option value="month">Per Bulan</option>
              <option value="student">Per Siswa</option>
            </select>
          </div>

          {exportOption === "day" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pilih Hari
              </label>
              <input
                type="date"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="input w-full max-w-xs input-bordered h-10 mb-4 text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>
          )}

          {exportOption === "month" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pilih Bulan
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="input w-full max-w-xs input-bordered h-10 mb-4 text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>
          )}

          {exportOption === "student" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pilih Siswa
              </label>
              <Select
                options={siswaOptionsExport}
                value={selectedSiswaExport}
                onChange={setSelectedSiswaExport}
                placeholder="Pilih Siswa"
                className="w-full max-w-xs text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                required
              />
            </div>
          )}

          <button
            onClick={() => exportPDF()}
            className="w-full mt-6 bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300 focus:ring focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={
              !exportOption ||
              (exportOption === "pilih" && !selectedDay) ||
              (exportOption === "month" && !selectedMonth) ||
              (exportOption === "student" && !selectedSiswaExport) ||
              (exportOption === "day" && !selectedDay) ||
              loadingExport
            }

          >
            Export
          </button>
        </div>
      </dialog>



    </>
  );
}

export default Index;
