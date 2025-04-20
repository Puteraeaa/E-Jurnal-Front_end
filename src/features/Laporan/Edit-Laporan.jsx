import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Api from "../../api";
import Cookies from "js-cookie";
import swal from "sweetalert2";
import toast from "react-hot-toast";
import CryptoJS from "crypto-js";

export default function EditUser() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState(""); // Initialize date state
  const [judul, setJudul] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [tools, setTools] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const token = Cookies.get("token");
  const [isLoading, setIsLoading] = useState(false);

   const decryptId = (encryptedId) => {
      const secretKey = process.env.REACT_APP_SECRET_KEY;
      const decoded = decodeURIComponent(encryptedId); 
      const bytes = CryptoJS.AES.decrypt(decoded, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
  };


        const encryptId = () => {
          const secretKey = process.env.REACT_APP_SECRET_KEY;
          const encrypted = CryptoJS.AES.encrypt(decryptedId.toString(), secretKey).toString();
      
          return encodeURIComponent(encrypted); // Encode hasil enkripsi agar valid di URL
        };

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
  
  const decryptedId = decryptId(id);

  useEffect(() => {
    // Set the default date to today's date
    const today = new Date().toISOString().split("T")[0];
    setTanggal(today);

    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const response = await Api.get(`admin/jurnal/${decryptedId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const report = response.data.data;
        setJudul(report.judul || "");
        setDeskripsi(report.description || "");
        setTanggal(report.date || today); // Use today if date is not available
        setStartTime(report.start_time || "");
        setEndTime(report.end_time || "");
        setTools(report.tools || "");
      } catch (error) {

        
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [id, token]);

  const updateUser = async (e) => {
    e.preventDefault();

    // Validasi minimal 150 karakter untuk deskripsi
    const newErrors = {};
    if (deskripsi.length < 150)
      newErrors.deskripsi = [
        "Deskripsi harus terdiri dari minimal 150 karakter"
      ];
    if (!tanggal) newErrors.tanggal = ["Tanggal Wajib diisi"];
    if (!startTime) newErrors.start_time = ["Start Time Wajib diisi"];
    if (!endTime) newErrors.end_time = ["End Time Wajib diisi"];
    if (!tools) newErrors.tools = ["Tools Wajib diisi"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);

    try {
      const result = await swal.fire({
        title: "Memperbarui Program",
        text: "Apakah Anda yakin ingin Memperbarui Program?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Perbarui!"
      });

      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("description", deskripsi);
        formData.append("start_time", startTime);
        formData.append("end_time", endTime);
        formData.append("tools", tools);
        formData.append("date", tanggal);
        if (image) formData.append("image", image);

        for (let [key, value] of formData.entries()) {
        }

        await Api.patch(`admin/jurnal/${decryptedId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        toast.success("Jurnal Berhasil DI update", {
          position: "top-right",
          duration: 4000
        });

        navigate(`/app/detail-laporan/${encryptId()}`);
      }
    } catch (error) {
      toast.error("Failed to update program. Please try again later.", {
        position: "top-right",
        duration: 4000
      }
    )
    ;
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="max-w-3xl  mx-auto p-6">
        <div className="card bg-base-100 shadow-xl border-t-4 border-primary">
          <div className="card-body">
            <h2 className="card-title text-primary text-2xl">
              Tambah Laporan Kegiatan PKL
            </h2>
            <p className="text-sm text-gray-500">
              Silakan isi form kegiatan kamu hari ini
            </p>
  
            <form onSubmit={updateUser} className="space-y-6 mt-4">
  
      <div className="form-control">
        <label className="label">
          <span className="label-text font-bold">Deskripsi Kegiatan</span>
        </label>
        <div className="rounded-lg border border-base-300 min-h-[150px]">
          <ReactQuill
            value={deskripsi}
            onChange={setDeskripsi}
            theme="snow"
            placeholder="Minimal 150 karakter..."
            className="min-h-[150px]"
            modules={modules}
            formats={formats}
          />
        </div>
       
        {errors.deskripsi && (
          <p className="text-error text-sm mt-1">{errors.deskripsi[0]}</p>
        )}
      </div>
  
      {/* GAMBAR */}
    <div className="form-control">
      <label className="label">
        <span className="label-text font-bold">Gambar (opsional)</span>
      </label>
      <input
        type="file"
        className="file-input file-input-bordered w-full"
        onChange={(e) => setImage(e.target.files[0])}
      />
    </div>
  
    {/* TOOLS */}
    <div className="form-control">
      <label className="label">
        <span className="label-text font-bold">Alat yang Digunakan</span>
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
        <label className="label">
          <span className="label-text font-bold">Tanggal</span>
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
        <label className="label">
          <span className="label-text font-bold">Waktu Mulai</span>
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
        <label className="label">
          <span className="label-text font-bold">Waktu Selesai</span>
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
        className={`btn btn-primary btn-block ${
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








