import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Api from "../../../api";
import { toast } from "react-hot-toast";
import { Clock, FileText, CheckCircle, UserCheck } from "lucide-react"; // Ikon modern

const Dashboard = () => {
  const user = JSON.parse(Cookies.get("user"));
  const userRole = user.roles;
  const token = Cookies.get("token");

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [jurnalRecords, setJurnalRecords] = useState([]);
  const [teacherDepartureRecords, setTeacherDepartureRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetchData();
    getAttendanceRecords();
    fetchEvents();

    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      let endpoint =
        userRole === "siswa"
          ? `admin/student-jurnal`
          : `admin/indexRole-jurnal`;

      const response = await Api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJurnalRecords(response.data.data.data || []);
    } catch (error) {
      toast.error("Gagal memuat data jurnal");
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceRecords = async () => {
    try {
      setLoading(true);
      let endpoint =
        userRole === "siswa"
          ? `/admin/absenSiswaOnly`
          : `/admin/absenSiswa`;

      const response = await Api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAttendanceRecords(Object.keys(response.data.data) || []);
    } catch (error) {
      toast.error("Gagal memuat data absensi");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      let endpoint =
        userRole === "siswa"
          ? `/admin/getSchedulleStudent`
          : `/admin/jadwal`;

      const response = await Api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const today = new Date().toISOString().split("T")[0];
      const allData = response.data.data;

      setTeacherDepartureRecords(allData[today] || []);
    } catch (error) {
      toast.error("Gagal memuat data aktivitas guru");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
      {/* Card Waktu Saat Ini */}
      <div className="card bg-base-100 shadow-md hover:shadow-lg transition">
        <div className="card-body">
          <div className="flex items-center gap-3">
            <Clock className="text-purple-500" size={28} />
            <h2 className="card-title">Waktu Saat Ini</h2>
          </div>
          <p className="text-3xl font-bold">{time.toLocaleTimeString("id-ID")} WIB</p>
          <p className="text-gray-500">Jam real-time</p>
        </div>
      </div>

      {/* Card Laporan PKL */}
      <div className="card bg-base-100 shadow-md hover:shadow-lg transition">
        <div className="card-body">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-500" size={28} />
            <h2 className="card-title">Laporan PKL</h2>
          </div>
          {loading ? (
            <div className="h-6 w-16 bg-gray-300 animate-pulse rounded-md"></div>
          ) : (
            <p className="text-3xl font-bold">{jurnalRecords.length}</p>
          )}
          <p className="text-gray-500">Jumlah laporan PKL yang dikirim</p>
        </div>
      </div>

      {/* Card Jumlah Absen */}
      <div className="card bg-base-100 shadow-md hover:shadow-lg transition">
        <div className="card-body">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={28} />
            <h2 className="card-title">Jumlah Absen</h2>
          </div>
          {loading ? (
            <div className="h-6 w-16 bg-gray-300 animate-pulse rounded-md"></div>
          ) : (
            <p className="text-3xl font-bold">{attendanceRecords.length}</p>
          )}
          <p className="text-gray-500">Absensi yang telah dilakukan</p>
        </div>
      </div>

      {/* Card Aktivitas Guru */}
      <div className="card bg-base-100 shadow-md hover:shadow-lg transition">
        <div className="card-body">
          <div className="flex items-center gap-3">
            <UserCheck className="text-yellow-500" size={28} />
            <h2 className="card-title">Aktivitas Guru</h2>
          </div>
          {teacherDepartureRecords.length > 0 ? (
            <ul className="list-disc ml-5">
              {teacherDepartureRecords.map((record) => (
                <li key={record.id} className="text-gray-700">
                  {record.status} ke {record.industri_name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-4 text-2xl">Tidak ada aktivitas guru</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
