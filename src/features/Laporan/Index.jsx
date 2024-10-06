import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../../api"; // Adjust the path to your Api configuration
import Cookies from "js-cookie";
import hasAnyPermission from "../../utils/Permissions";

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

function Index() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
      currentPage: 1,
      perPage: 5, // Ensure itemsPerPage is consistent
      total: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state

  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("user"));
  const navigate = useNavigate();

  const extractPlainText = (htmlContent) => {
    if (!htmlContent) return ""; // Return an empty string if htmlContent is undefined or null
    return htmlContent.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const fetchClasses = async () => {
    try {
      const response = await Api.get("admin/classes", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClasses(
        Array.isArray(response.data.data.data) ? response.data.data.data : []
      ); // Ensure it's an array
    } catch (error) {}
  };

  const fetchDepartments = async () => {
    try {
      const response = await Api.get("admin/departemen", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDepartments(
        Array.isArray(response.data.data.data) ? response.data.data.data : []
      );
    } catch (error) {}
  };

  const fetchData = async () => {
    const role = user.roles;
    

    try {
      let response;
      const params = new URLSearchParams({
        search: searchQuery,
        departemen_id: selectedDepartment,
        classes_id: selectedClass,
        page: currentPage
      }).toString();

      // Debugging log

      if (role === "siswa") {
        response = await Api.get(`admin/student-jurnal`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else if (role === "guru") {
        response = await Api.get(`admin/indexRole-jurnal?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else if (role === "orang tua") {
        response = await Api.get(`admin/indexRole-jurnal?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        response = await Api.get(`admin/indexRole-jurnal?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      const sortedData = (response.data.data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAttendanceRecords(sortedData);  
      setPagination({
        currentPage: response.data.data.current_page,
        perPage: response.data.data.per_page,
        total: response.data.data.total
    });
    console.log(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);

    }
  };

  useEffect(() => {
    fetchClasses();
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchData(currentPage);
  }, [searchQuery, selectedClass, selectedDepartment, currentPage]);

  const handleRowClick = (id) => {
    navigate(`/app/detail-laporan/${id}`);
  };

  const totalPages = Math.ceil(pagination.total / pagination.perPage);

  const handleClick = (pageNumber) => {
      setCurrentPage(pageNumber);
  };

 

  const filteredLeads = attendanceRecords.filter(lead =>
      lead.users.students?.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );
  

  const renderPagination = () => {
    const pages = [];
    const totalPages = Math.ceil(pagination.total / pagination.perPage);
    
    // Always show the first page
    pages.push(
      <button
        key={1}
        className={`join-item btn ${pagination.currentPage === 1 ? "btn-active" : ""}`}
        onClick={() => handleClick(1)}
      >
        1
      </button>
    );
  
    // Show dots if needed
    if (pagination.currentPage > 3) {
      pages.push(
        <button key="prev-ellipsis" className="join-item btn btn-disabled">...</button>
      );
    }
  
    // Show pages around the current page
    const startPage = Math.max(2, pagination.currentPage - 1);
    const endPage = Math.min(totalPages - 1, pagination.currentPage + 1);
  
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`join-item btn ${pagination.currentPage === i ? "btn-active" : ""}`}
          onClick={() => handleClick(i)}
        >
          {i}
        </button>
      );
    }
  
    // Show dots if needed
    if (pagination.currentPage < totalPages - 2) {
      pages.push(
        <button key="next-ellipsis" className="join-item btn btn-disabled">...</button>
      );
    }
  
    // Always show the last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`join-item btn ${pagination.currentPage === totalPages ? "btn-active" : ""}`}
          onClick={() => handleClick(totalPages)}
        >
          {totalPages}
        </button>
      );

      return <>{pages}</>;
    }
  }


  return (
    <>
    <div className="container mx-auto p-6">
      <div className="bg-white dark:bg-[#1c2229] shadow-md rounded-lg p-6 mb-6">
        <p className="border-b pb-2 font-bold text-xl md:text-4xl text-center">
          <i className="fas fa-chart-pie dark:text-white text-blue-600"></i>{" "}
          Jurnal Laporan Harian
        </p>
        <p className="text-gray-600 font-semibold mt-2 dark:text-white text-center text-xs md:text-base">
          Ini adalah laporan PKL yang dibuat oleh Siswa SMKN 1 Ciomas dari semua{" "}
          <span className="font-bold"></span> kejuruan.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input w-full max-w-xs input-bordered h-9"
        />
        {hasAnyPermission(["siswa.delete", "penilaian.create"]) && (
          <button
            onClick={() => document.getElementById("my_modal_3").showModal()}
            className="inline-block bg-blue-500 text-white text-sm font-semibold md:py-1 md:px-2 md:text-base py-1 px-2 rounded hover:bg-blue-600 transition-colors duration-300"
          >
            <i className="fa-solid fa-filter"></i> Filter
          </button>
        )}
               {hasAnyPermission(["murid.index"]) && (
        <Link
          to="/app/laporan-pkl/tambah"
          className="inline-block bg-blue-500 text-white text-sm font-semibold md:py-1 md:px-2 md:text-base py-1 px-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          <i className="fa-solid fa-plus"></i> Tambah Laporan
        </Link>
      )}
      </div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Filter</h3>
          <div className="mt-4 ">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kelas
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="select w-full max-w-xs input-bordered h-9"
            >
              <option value="">Pilih Kelas</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jurusan
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="select w-full max-w-xs input-bordered h-9 mb-4 text-gray-700 dark:text-gray-300"
            >
              <option value="">Pilih Jurusan</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </dialog>

      <div className="overflow-x-auto mt-6">
        <table className="md:w-[100%] w-[400%]  divide-y divide-gray-200 ">
          <thead className="bg-gray-100 dark:bg-gray-900 dark:text-white">
            <tr>
            <th className="px-6 py-3 text-left  text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider=">
                No
              </th>
              <th className="px-6 py-3 text-left  text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider=">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Tempat PKL
              </th>
              <th className="px-6 py-3 text-left  text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Jurusan 
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                Deskripsi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, index) => <SkeletonRow key={index} />)
            ) : filteredLeads.length > 0 ? (
              filteredLeads.map((record) => (
                <tr
                  key={record.id}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800"
                  onClick={() => handleRowClick(record.id)}
                >
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {record.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 w-[200px]">
                    <div className="flex items-center">
                      <img
                         src={
                          record.users?.students?.image && record.users.students?.image !== "https://api.jurnal.pplgsmkn1ciomas.my.id/storage"
                            ? record.users.students.image
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        alt="Profile Mentor"
                        className="w-10 h-10 rounded-full border object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white w-[200px]">
                          {record.users.students?.name ?? "-"}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          {record.users?.students?.classes?.name ?? "-"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white w-[200px]">
                    {record.users?.students?.industries?.name ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white w-[200px]">
                    {record.users?.students?.departements?.name ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 w-[130px]">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 truncate-multiline mb-3">
                    {extractPlainText(record.description)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-gray-600 dark:text-white"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
     
    </div>
    <div className="flex justify-center mt-4 gap-2">
                    {renderPagination()}
                </div>
     </>
  );
}

export default Index;
