import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function UserCreate() {
  document.title = "Create User - NewsApp Administrator";

  const navigate = useNavigate();
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [judul, setJudul] = useState("");
  const [errors, setErrors] = useState([]);

  const storeUser = (e) => {
    e.preventDefault();

    // Simulate form validation
    const newErrors = {};
    if (!deskripsi) newErrors.deskripsi = ["Deskripsi Wajib diisi"];
    if (!judul) newErrors.judul = ["Judul Wajib diisi"];
    if (!tanggal) newErrors.tanggal = ["Tanggal Wajib diisi"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate successful form submission
    alert("User created successfully!");
    navigate("/teachers");
  };

  return (
    <div className="container mx-auto my-10">
      <div className="flex flex-col">
        <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
          <h1 className="text-3xl font-bold text-center mb-4">
            Tambah Laporan Kegiatan PKL
          </h1>
          <p className="text-center border-b pb-4 mb-4">
            Silakan isi form di bawah!
          </p>

          <form onSubmit={storeUser}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Judul
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Enter Judul Laporan"
              />
              {errors.judul && (
                <div className="text-red-600 mt-2">{errors.judul[0]}</div>
              )}
            </div>

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
                Tanggal Laporan
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
              {errors.tanggal && (
                <div className="text-red-600 mt-2 bg-red-200 p-1 rounded-lg">{errors.tanggal[0]}</div>
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
