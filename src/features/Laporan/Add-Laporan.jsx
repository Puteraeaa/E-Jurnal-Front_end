import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Api from "../../api";
import Cookies from "js-cookie";
import swal from "sweetalert2";
import toast from "react-hot-toast";

export default function UserCreate() {
  document.title = "Create User - NewsApp Administrator";

  const navigate = useNavigate();
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [judul, setJudul] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [tools, setTools] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const token = Cookies.get("token");

  const storeUser = async (e) => {
      e.preventDefault();

      // Validasi minimal 150 karakter untuk deskripsi
      const newErrors = {};
      if (deskripsi.length < 150) newErrors.deskripsi = ["Deskripsi harus terdiri dari minimal 150 karakter"];
      if (!tanggal) newErrors.tanggal = ["Tanggal Wajib diisi"];
      if (!startTime) newErrors.start_time = ["Start Time Wajib diisi"];
      if (!endTime) newErrors.end_time = ["End Time Wajib diisi"];
      if (!tools) newErrors.tools = ["Tools Wajib diisi"];

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      try {
          const result = await swal.fire({
              title: "Memperbarui Program",
              text: "Apakah Anda yakin ingin Memperbarui Program?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ya, Perbarui!",
          });
  
          if (result.isConfirmed) {
              const formData = new FormData();
              formData.append('description', deskripsi);
              formData.append('start_time', startTime);
              formData.append('end_time', endTime);
              formData.append('tools', tools);
              formData.append('date', tanggal);
              if (image) formData.append('image', image);

              await Api.post(`admin/jurnal`, formData, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'multipart/form-data',
                  }
              });

              toast.success('Program updated successfully!', {
                  position: "top-right",
                  duration: 4000,
              });

              navigate('/app/laporan');
          }
      } catch (error) {
          console.error('Error updating program:', error.response);
          toast.error('Failed to update program. Please try again later.', {
              position: "top-right",
              duration: 4000,
          });
      }
  }

  return (
    <div className="container mx-auto my-10">
      <div className="flex flex-col">
        <div className="dark:bg-gray-800 bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
          <h1 className="text-3xl font-bold text-center mb-4">
            Tambah Laporan Kegiatan PKL
          </h1>
          <p className="text-center border-b pb-4 mb-4">
            Silakan isi form di bawah!
          </p>

          <form onSubmit={storeUser}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Deskripsi Laporan
              </label>
              <ReactQuill
                value={deskripsi}
                onChange={setDeskripsi}
                className="bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                theme="snow"
                placeholder="Describe your activity..."
              />
              {errors.deskripsi && (
                <div className="text-red-600 mt-2">{errors.deskripsi[0]}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Image (optional)
              </label>
              <input
                type="file"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Tools Used
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={tools}
                onChange={(e) => setTools(e.target.value)}
                placeholder="Enter tools used"
              />
              {errors.tools && (
                <div className="text-red-600 mt-2">{errors.tools[0]}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Tanggal Laporan
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
              {errors.tanggal && (
                <div className="text-red-600 mt-2 p-1 rounded-lg">{errors.tanggal[0]}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Start Time
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              {errors.start_time && (
                <div className="text-red-600 mt-2">{errors.start_time[0]}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                End Time
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              {errors.end_time && (
                <div className="text-red-600 mt-2">{errors.end_time[0]}</div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-lg"
              >
                <i className="fa fa-save mr-2"></i> Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
