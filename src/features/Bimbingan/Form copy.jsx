import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../api";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { showNotification } from "../../features/common/headerSlice";

const InternshipForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("user"));
  const [profile, setProfile] = useState({});
  const [Loading, setLoading] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [date, setDate] = useState("");

  const getUser  = async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/admin/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data.data.student || response.data.data);
      console.log("User  data:", response.data.data.student);
    } catch (error) {
      console.error("Error fetching user:", error.message);
      dispatch(
        showNotification({ message: "Failed to load user data", status: 0 })
      );
    }finally {
      setLoading(false);
    }
  };

  const getBimbingan  = async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/admin/laporan-bimbingan/studentOnly?page=1
`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data.data.student || response.data.data);
      console.log("User  bimbingan:", response.data.data.student);
    } catch (error) {
      console.error("Error fetching Bimbingan:", error);
      dispatch(
        showNotification({ message: "Failed to load user data", status: 0 })
      );
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser ();
    getBimbingan ();
  }, []);

  const addBimbingan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Api.post(
        `/admin/laporan-bimbingan`,
        { catatan, date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Bimbingan added:", response.data);
      dispatch(
        showNotification({ message: "Bimbingan added successfully", status: 1 })
      );
      setCatatan(""); // Reset catatan
      setDate(""); // Reset date
    } catch (error) {
      dispatch(
        showNotification({ message: "Failed to add bimbingan", status: 0 })
      );
    } finally {
      setLoading(false);
    }
  };


  if (Loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );

  return (
    <main>
      
    <div className="container mx-auto p-6">
      {/* Page Title */}
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
            Kartu Bimbingan Sekolah
          </p>
          <p className="text-gray-600 font-semibold mt-2 dark:text-white text-center text-xs md:text-base">
            Data Kartu Bimbingan Sekolah
          </p>

          {/* Tombol Back */}
        </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

        {/* Profile Information Section */}
        <div className="bg-white shadow-lg p-6 rounded-lg col-span-3">
          <h4 className="text-lg font-bold mb-4 text-gray-700">Informasi Siswa</h4>
          <div className="space-y-3">
            <div className="text-gray-800">
              <span className="font-semibold">Nama Siswa:</span>
              <span className="ml-2">{profile.name || "N/A"}</span>
            </div>
            <div className="text-gray-800">
              <span className="font-semibold">Kelas:</span>
              <span className="ml-2">{profile.classes?.name || "N/A"}</span>
            </div>
            <div className="text-gray-800">
              <span className="font-semibold">Nama Pembimbing Sekolah:</span>
              <span className="ml-2">{profile.teachers?.name || "N/A"}</span>
            </div>
            <div className="text-gray-800">
              <span className="font-semibold">Tempat PKL:</span>
              <span className="ml-2">{profile.industries?.name || "N/A"}</span>
            </div>
          </div>
        </div>

       

        {/* Profile Image Section */}
        <div className="flex items-center justify-center bg-white shadow-lg p-4 rounded-lg">
          <div className="text-center">
          
            <img 
              src={profile.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
              alt="Profile" 
              className="w-40 h-[180px] object-cover rounded-md border-2 border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* BUTTON ADD*/}
      <div className="flex justify-start  "> 
      <button className="btn bg-[#2664eb] btn-active text-white  hover:bg-[#2004eb]" onClick={()=>document.getElementById('my_modal_2').showModal()}>Tambah Data</button>
      </div>

      <div className="w-full bg-white border border-gray-300 rounded-lg shadow-lg p-8 mt-6">
        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-3 text-center">Hari / Tanggal</th>
                <th className="border border-gray-300 p-3 text-center">Catatan</th>
                <th className="border border-gray-300 p-3 text-center">Paraf Pembimbing</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white hover:bg-gray-50 transition duration-200">
                <td className="border border-gray-300 p-3 text-center">
                  Kamis <br /> 26 - 09 - 2024
                </td>
                <td className="border border-gray-300 p-3">
                  Evaluasi dan Monitoring Bimbingan PKL
                </td>
                <td className="border border-gray-300 p-3 text-center text-4xl"> ✅</td>
              </tr>
              {/* Additional rows can be added here */}
            </tbody>
          </table>
        </div>
      </div>

      

    </div>

 {/* Modal */}
 <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Tambah Catatan</h3>
            <form onSubmit={addBimbingan} className="py-4">
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Tanggal
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                  Catatan
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  required
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                ></textarea>
              </div>
              <div className="modal-action">
                <button type="submit" className="btn">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("my_modal_2").close()}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </dialog>

</main>

    
  );
};

export default InternshipForm;