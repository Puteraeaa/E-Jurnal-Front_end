import React,{ useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TitleCard from "../../../components/Cards/TitleCard"; // Adjust the import path if necessary
import jurnal from "../../../assets/Jurnal.png";
import jurnalDark from "../../../assets/Jurnal-dark.png";
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
    } catch (error) {
        console.error("Error fetching user:", error.message);
        
    }
};

useEffect(() => {
    getUser();
}, []);


  return (
    <>
      <div class="flex-auto p-4 bg-white dark:bg-[#1c2229] mb-10  md:w-[1530px]  shadow-md rounded-xl ">
        <div class="flex flex-wrap-mx-3">
          <div class="max-w-full px-3  lg:flex-none">
            <div class="flex flex-col h-full">
              <p class="pt-2 mb-1 font-semibold text-2xl">
                Hai {profile.student?.name || profile.teachers?.name || profile.industries?.name ||profile.name} <span className="text-3xl">👋</span>
              </p>
              <h5 class="font-bold">Selamat Datang Di Website E-jurnal</h5>
              <p class="mb-12 md:w-[800px]">
                E-Jurnal PKL SMKN 1 Ciomas adalah platform digital bagi siswa
                untuk mencatat kegiatan harian selama PKL dan melakukan absensi.
              </p>
              <div className="flex space-x-4 mb-4 mt-[-20px]">
                <Link
                  className="text-black-800 dark:text-white font-bold leading-normal text-sm group  bg-gradient-to-tl from-blue-400 to-blue-500 w-36 py-2.5 rounded-xl text-center"
                  to={"/app/laporan-pkl"}
                >
                  Lihat Jurnal
                 
                </Link>
                
                {userRole === "siswa" ? (
                  <Link
                    className="text-black-800 dark:text-white font-bold leading-normal text-sm group  bg-gradient-to-tl from-green-400 to-green-500 w-36 py-2.5 rounded-xl text-center"
                    to={"/app/absensi"}
                  >
                    Ayo Absen
                   
                  </Link>
                ) : userRole === "guru" || userRole === "industri" || userRole === "orang tua" ? (
                  <Link
                    className="text-black-800 font-bold leading-normal text-sm group  bg-gradient-to-tl from-green-400 to-green-500 w-36 py-2.5 rounded-xl text-center"
                    to={"/app/rekap-absensi"}
                  >
                    Rekap Absen
                   
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
          <div class="max-w-full px-3 mt-12 ml-auto text-center lg:mt-0 lg:w-[500px] lg:flex-none">
            <div class="h-full bg-gradient-to-t from-gray-200 to-gray-400 rounded-xl hidden dark:bg-gradient-to-t  dark:from-gray-700 dark:to-gray-800 lg:block">
              <div class="relative flex items-center justify-center h-[200px] z-[1] ">
                <img
                  class="relative z-20 w-full h-full object-cover object-center  mt-2 dark:hidden block "
                  src={jurnal}
                  alt="rocket"
                />
                <img
                  class="relative z-20 w-full h-full object-cover object-center  mt-2 hidden dark:block"
                  src={jurnalDark}
                  alt="rocket"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
