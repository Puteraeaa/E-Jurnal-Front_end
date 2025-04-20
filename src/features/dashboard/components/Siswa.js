import React,{ useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TitleCard from "../../../components/Cards/TitleCard"; // Adjust the import path if necessary
import jurnal from "../../../assets/simonik.png";
import jurnalDark from "../../../assets/simonik-night.png";
import Cookies from "js-cookie";
import Api from "../../../api";


const Dashboard = () => {

  const user = JSON.parse(Cookies.get("user"));
  const token = Cookies.get("token");

const userRole = user.roles;

const [profile, setProfile] = useState([]);


  const getUser = async () => {
    const userId = user.id;
    try {
        const response = await Api.get(`/admin/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setProfile(response.data.data);
        console.log("User data:", response.data.data);
    } catch (error) {
        console.error("Error fetching user:", error.message);
        
    }
};

useEffect(() => {
    getUser();
}, []);


  return (
    <>
      <div className="flex-auto p-4 bg-white dark:bg-[#1c2229] mb-10 md:w-full shadow-md rounded-xl">
        <div className="">
          <div className="w-full px-3 lg:w-auto lg:mx-auto">
            <div className=" h-full">
              <p className="pt-2 mb-1 font-semibold text-2xl">
                Hai {profile.student?.name || profile.teacher?.name || profile.industries?.name || profile.name} <span className="text-3xl">👋</span>
              </p>
              <h5 className="font-bold">Selamat Datang Di Website SIMONIK</h5>
              <p className="mb-12 w-auto text-gray-500 dark:text-gray-400">
                SIMONIK SMKN 1 Ciomas adalah platform digital bagi siswa
                untuk mencatat kegiatan harian selama PKL dan melakukan absensi.
              </p>
              <div className="flex space-x-4 mb-4 mt-[-20px]">
                <Link
                  className="text-black-800 dark:text-white font-bold leading-normal text-sm group bg-gradient-to-tl from-blue-400 to-blue-500 w-36 py-2.5 rounded-xl text-center"
                  to={"/app/laporan-pkl"}
                >
                  Lihat Jurnal
                </Link>
                {userRole === "siswa" ? (
                  <Link
                    className="text-black-800 dark:text-white font-bold leading-normal text-sm group bg-gradient-to-tl from-green-400 to-green-500 w-36 py-2.5 rounded-xl text-center"
                    to={"/app/absensi"}
                  >
                    Ayo Absen
                  </Link>
                ) : userRole === "guru" || userRole === "industri" || userRole === "orang tua" ? (
                  <Link
                    className="text-black-800 dark:text-white font-bold leading-normal text-sm group bg-gradient-to-tl from-green-400 to-green-500 w-36 py-2.5 rounded-xl text-center"
                    to={"/app/rekap-absensi"}
                  >
                    Rekap Absen
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
