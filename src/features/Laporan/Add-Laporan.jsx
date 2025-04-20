import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Api from "../../api";
import Cookies from "js-cookie";
import swal from "sweetalert2";
import toast from "react-hot-toast";

export default function UserCreate() {
  const navigate = useNavigate();
  const [deskripsi, setDeskripsi] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [tanggal, setTanggal] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [tools, setTools] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ font: [] }],
      ['link', 'image', 'video'],
     
    ]
  };

  const formats = [
    'header',
    'bold', 'italic',
    'list', 'bullet',
    'link', 'image', 'video',
    'font'
  ];
  

  const token = Cookies.get("token");

  const handleDeskripsiChange = (value) => {
    setDeskripsi(value);
    setCharCount(value.replace(/<[^>]+>/g, "").length);
  };

  const storeUser = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (deskripsi.length < 150)
      newErrors.deskripsi = [
        "Deskripsi harus terdiri dari minimal 150 karakter"
      ];
    if (!tanggal) newErrors.tanggal = ["Tanggal Wajib diisi"];
    if (!startTime) newErrors.start_time = ["Waktu mulai wajib diisi"];
    if (!endTime) newErrors.end_time = ["Waktu selesai wajib diisi"];
    if (!tools) newErrors.tools = ["Alat yang digunakan wajib diisi"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await swal.fire({
        title: "Tambah Jurnal Harian",
        text: "Apakah Anda yakin ingin menambahkan jurnal harian?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Tambah!"
      });

      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("description", deskripsi);
        formData.append("start_time", startTime);
        formData.append("end_time", endTime);
        formData.append("tools", tools);
        formData.append("date", tanggal);
        if (image) formData.append("image", image);

        await Api.post(`admin/jurnal`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });

        toast.success("Laporan berhasil ditambahkan!", {
          position: "top-right",
          duration: 4000
        });

        navigate("/app/laporan-pkl");
      }
    } catch (error) {
      toast.error("Gagal menambahkan laporan. Coba lagi nanti.", {
        position: "top-right",
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" mx-auto p-4 sm:p-6">
      <div className="bg-base-100 shadow-md border border-gray-200 rounded-xl">
        <div className="px-6 py-5">
          <h2 className="text-xl font-bold text-primary mb-1">
            Tambah Laporan Kegiatan PKL
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Silakan isi laporan kegiatan kamu hari ini.
          </p>
  
          <form onSubmit={storeUser} className="space-y-6">
           { /* DESKRIPSI */}
                  <div className="form-control">
                    <label className="label font-semibold">
                    <span className="label-text">Deskripsi Kegiatan</span>
                    </label>
                    <div className="rounded-lg border border-base-300 overflow-hidden">
                    <ReactQuill
                      value={deskripsi}
                      onChange={handleDeskripsiChange}
                      theme="snow"
                      placeholder="Minimal 150 karakter..."
                      style={{ height: "200px" }}
                      modules={modules}
                      formats={formats}
                    />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Karakter: {charCount}</p>
                    {errors.deskripsi && (
                    <p className="text-error text-sm mt-1">{errors.deskripsi[0]}</p>
                    )}
                  </div>
              
                  {/* GAMBAR */}
            <div className="form-control hidden">
              <label className="label font-semibold">
                <span className="label-text">Gambar (opsional)</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
  
            {/* TOOLS */}
            <div className="form-control">
              <label className="label font-semibold">
                <span className="label-text">Alat yang Digunakan</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={tools}
                onChange={(e) => setTools(e.target.value)}
                placeholder="Contoh: Laptop, Visual Studio Code"
              />
              {errors.tools && (
                <p className="text-error text-sm mt-1">{errors.tools[0]}</p>
              )}
            </div>
  
            {/* TANGGAL & WAKTU */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label font-semibold">
                  <span className="label-text">Tanggal</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                />
                {errors.tanggal && (
                  <p className="text-error text-sm mt-1">{errors.tanggal[0]}</p>
                )}
              </div>
  
              <div className="form-control">
                <label className="label font-semibold">
                  <span className="label-text">Waktu Mulai</span>
                </label>
                <input
                  type="time"
                  className="input input-bordered w-full"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                {errors.start_time && (
                  <p className="text-error text-sm mt-1">{errors.start_time[0]}</p>
                )}
              </div>
  
              <div className="form-control">
                <label className="label font-semibold">
                  <span className="label-text">Waktu Selesai</span>
                </label>
                <input
                  type="time"
                  className="input input-bordered w-full"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
                {errors.end_time && (
                  <p className="text-error text-sm mt-1">{errors.end_time[0]}</p>
                )}
              </div>
            </div>
  
            {/* BUTTON */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full transition-all duration-200 ${
                  isLoading ? "loading btn-disabled" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan Laporan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
}
