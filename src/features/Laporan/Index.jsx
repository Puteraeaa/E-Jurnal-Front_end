import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Api from '../../api'; // Adjust the path to your Api configuration
import Cookies from 'js-cookie';

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
    </tr>
  );
}

function Index() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const token = Cookies.get('token');
  const user = Cookies.get('user'); // Replace with actual token
  const navigate = useNavigate(); // For programmatic navigation

  const extractPlainText = (htmlContent) => {
    return htmlContent.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const fetchData = async () => {
    const role = user.role; // Assuming `user.role` contains the role of the user (e.g., "student", "teacher", etc.)

    try {
      let response;
      const params = new URLSearchParams({
        search: searchQuery,
        class: selectedClass,
        department: selectedDepartment,
      }).toString();

      if (role === 'student') {
        response = await Api.get(`admin/jurnal/${user.id}?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await Api.get(`admin/jurnal?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setAttendanceRecords(response.data.data.data);
      console.log(response.data.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedClass, selectedDepartment]); // Refetch data when search or filters change

  const handleRowClick = (id) => {
    navigate(`/app/detail-laporan/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white dark:bg-[#1c2229] shadow-md rounded-lg p-6 mb-6">
        <p className="border-b pb-2 font-bold text-xl md:text-4xl text-center">
          <i className="fas fa-chart-pie dark:text-white text-blue-600"></i> Data Laporan PKL
        </p>
        <p className="text-gray-600 font-semibold mt-2 dark:text-white text-center text-xs md:text-base">
          Ini adalah laporan PKL yang dibuat oleh Siswa SMKN 1 Ciomas dari semua <span className="font-bold"></span> kejuruan.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input w-full max-w-xs input-bordered h-9 mx-auto md:ml-3"
        />
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="select w-full max-w-xs input-bordered h-9 mx-auto md:ml-3"
        >
          <option value="">Select Class</option>
          {/* Replace with actual class options */}
          <option value="class1">Class 1</option>
          <option value="class2">Class 2</option>
        </select>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="select w-full max-w-xs input-bordered h-9 mx-auto md:ml-3"
        >
          <option value="">Select Department</option>
          {/* Replace with actual department options */}
          <option value="dept1">Department 1</option>
          <option value="dept2">Department 2</option>
        </select>
      </div>

      <Link 
        to="/app/laporan-pkl/tambah" 
        className="inline-block bg-blue-500 text-white text-sm font-semibold md:py-1 md:px-2 md:text-base py-1 px-2 rounded hover:bg-blue-600 transition-colors duration-300 md:mb-5 mb-4 ml-20 md:ml-4"
      >
        Tambah Laporan
      </Link>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"> Tempat PKL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">jurusan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Deskripsi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {loading ? (
              Array(6).fill(0).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : attendanceRecords.length > 0 ? (
              attendanceRecords.map(record => (
                <tr
                  key={record.id}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleRowClick(record.id)}
                >
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 w-[200px]">
                    <div className="flex items-center">
                      <img
                        src={record.users?.students?.image ??  "https://picsum.photos/200/300"} // Use record's image or placeholder
                        alt="Profile Mentor"
                        className="w-10 h-10 rounded-full border object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{record.users.name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs"> {record.users?.students?.classes?.name ?? "-"}  </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white w-[200px]">
                  {record.users?.students?.industries?.name ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white w-[200px]">
                  {record.users?.students?.departements?.name ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 w-[130px]">{record.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 truncate-multiline mb-3">{extractPlainText(record.description)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-600 dark:text-white">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Index;
