import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Api from "../../../api";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const user = JSON.parse(Cookies.get("user"));
  const userRole = user.roles;
  const token = Cookies.get("token");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [jurnalRecords, setJurnalRecords] = useState([]);
  const [teacherDepartureRecords, setTeacherDepartureRecords] = useState([]);

  const fetchData = async () => {
    const role = user.roles;

    try {
      let response;

      if (role === "siswa") {
        response = await Api.get(`admin/student-jurnal`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else if (role === "guru" || role === "orang tua") {
        response = await Api.get(`admin/indexRole-jurnal`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        response = await Api.get(`admin/jurnal`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      setJurnalRecords(response.data.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch jurnal records");
      console.log(error);
    }
  };

  const getAttendanceRecords = async () => {
    const role = user.roles;

    try {
      let endpoint = "";

      if (role === "siswa") {
        endpoint = `/admin/absenSiswaOnly`;
      } else if (role === "guru" || role === "orang tua") {
        endpoint = `/admin/absenSiswa`;
      } else {
        endpoint = `/admin/absence`;
      }

      const response = await Api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAttendanceRecords(Object.keys(response.data.data) || []);
    } catch (error) {
      toast.error("Failed to fetch attendance records");
      console.log(error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await Api.get(`/admin/jadwal`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const allData = response.data.data;
      console.log("Data dari API:", allData);

      const today = new Date().toISOString().split('T')[0]; // Format tanggal hari ini

      // Jika allData adalah objek dengan tanggal sebagai kunci
      if (typeof allData === 'object' && !Array.isArray(allData)) {
        const todayRecords = allData[today] || [];
        console.log("Data untuk hari ini:", todayRecords);
        setTeacherDepartureRecords(todayRecords);
      } else {
        console.error("Data tidak dalam format objek.");
      }
    } catch (error) {
      toast.error("Failed to fetch teacher departure records");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchData();
    getAttendanceRecords();
  }, []);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000); // Update setiap detik
    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, []);

  const formattedTime = time.toLocaleTimeString();

  return (
    <div className="dark:text-gray-100 flex flex-wrap gap-y-6 sm:gap-6 gap-2">
      {userRole === "siswa" ? (
        <div className="flex flex-wrap gap-y-6 sm:gap-6 gap-2">
          {/* Komponen untuk siswa */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full sm:w-[365px]">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Waktu Saat Ini
              </div>
              <svg
                className="w-6 h-6 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3v18l15-9L5 3z"
                />
              </svg>
            </div>
            <div className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
              {formattedTime}
            </div>
            <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Jam yang menunjukkan waktu saat ini secara real-time.
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full sm:w-[365px]">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Jumlah Laporan PKL
              </div>
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 10h16m-7 4h7"
                />
              </svg>
            </div>
            <div className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
              {jurnalRecords.length}
            </div>
            <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Jumlah total laporan PKL yang sudah dikirim oleh siswa.
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full sm:w-[365px]">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Jumlah Absen yang telah dilakukan
              </div>
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16m-7 4h7m-7 4h7"
                />
              </svg>
            </div>
            <div className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
              {attendanceRecords.length}
            </div>
            <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Jumlah absensi yang telah dilakukan oleh Anda.
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full sm:w-[365px]">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Aktifitas Guru
              </div>
              <svg
                className="w-6 h-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <div className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
              <p className="text-xl">{teacherDepartureRecords.map(record => (
            <li key={record.id} className="list-none">
              {record.status} ke {record.industri_name}
            </li>
          ))}</p>
              
            </div>
            <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Data keberangkatan guru
            </div>
          </div>
        </div>
      ) : userRole === "guru" ||
        userRole === "industri" ||
        userRole === "orang tua" ? (
          <div className="flex flex-wrap gap-y-6 sm:gap-6 gap-2">
          {/* Komponen untuk siswa */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full sm:w-[365px]">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Waktu Saat Ini
              </div>
              <svg
                className="w-6 h-6 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3v18l15-9L5 3z"
                />
              </svg>
            </div>
            <div className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
              {formattedTime}
            </div>
            <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Jam yang menunjukkan waktu saat ini secara real-time.
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full sm:w-[365px]">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Jumlah Laporan PKL
              </div>
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 10h16m-7 4h7"
                />
              </svg>
            </div>
            <div className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
              {jurnalRecords.length}
            </div>
            <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Jumlah total laporan PKL yang sudah dikirim oleh siswa.
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full sm:w-[365px]">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Jumlah Absen yang telah dilakukan
              </div>
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16m-7 4h7m-7 4h7"
                />
              </svg>
            </div>
            <div className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
              {attendanceRecords.length}
            </div>
            <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Jumlah absensi yang telah dilakukan oleh Anda.
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full sm:w-[365px]">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Aktivitas Guru
              </div>
              <svg
                className="w-6 h-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
              <p className="text-base">{teacherDepartureRecords.map(record => (
            <li key={record.id} className="list-none">
              {record.status} PKL ke {record.industri_name}
            </li>
          ))}</p>
              
            </div>
            <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Data Kegiatan guru
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
