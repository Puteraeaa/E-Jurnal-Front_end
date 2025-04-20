import React from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import smk from "../../assets/smk.png";
import Cookies from "js-cookie";
import Api from "../../api";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate




const Rapot = () => {
  const [nilaiProduktif, setNilaiProduktif] = useState({});
  const [nilaiKepribadian, setNilaiKepribadian] = useState({});
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("user"));
  const [profile, setProfile] = useState({});
  const toWords = require("angka-terbilang-ts").default;  
  const navigate = useNavigate();

  const exportToPDF = () => {
    const element = document.getElementById("rapot");
  
  
    // Tentukan ukuran kertas
    const pdfWidth = 210; // dalam mm
    const pdfHeight = 297; // dalam mm
    const aspectRatio = pdfWidth / pdfHeight;
  
    // Gunakan html2canvas untuk mengambil elemen
    html2canvas(element, {
      useCORS: true,
      scale: 2,
      backgroundColor: "#fff",
    }).then((canvas) => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
  
      // Sesuaikan proporsi untuk PDF
      let exportWidth, exportHeight;
      if (canvasWidth / canvasHeight > aspectRatio) {
        exportWidth = pdfWidth;
        exportHeight = (canvasHeight / canvasWidth) * pdfWidth;
      } else {
        exportHeight = pdfHeight;
        exportWidth = (canvasWidth / canvasHeight) * pdfHeight;
      }
  
      // Dapatkan data gambar dari canvas
      const imgData = canvas.toDataURL("image/png");
  
      // Buat instance jsPDF
      const pdf = new jsPDF("portrait", "mm", "a4");
  
      // Tambahkan gambar ke PDF
      pdf.addImage(imgData, "PNG", 0, 0, exportWidth, exportHeight);
  
      // Simpan PDF
      pdf.save("rapot.pdf");
  
      navigate("/app/rekapnilai");
    });
  };


  const data = {
    nama_siswa: "John Doe",
    kelas: "XII RPL 1",
    kepribadian: {
      Disiplin: "A",
      Kerjasama: "B+",
      TanggungJawab: "A-",
      Kreativitas: "B",
    },
    nilai_produktif: {
      "Pemrograman Dasar": 85,
      "Pemrograman Lanjut": 90,
      "Proyek Akhir": 88,
    },
  };

  const contentRef = React.createRef();

  const fetchNilai = async () => {
    setLoading(true);
    try {
      const produktifResponse = await Api.get(`/admin/penilaian-siswa`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNilaiProduktif(produktifResponse.data.data[0] || {}); // Set to an empty object if undefined
    } catch (error) {
      console.error("Error fetching nilai:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadDataProductivity = async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/admin/penilaian/siswa`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNilaiKepribadian(response.data.data.data[0] || {}); // Set to an empty object if undefined
    } catch (error) {
      console.error("Error fetching lead productivity data:", error);
    } finally {
      setLoading(false); // Set loading to false here
    }
  };

  const calculateAverageKepribadian = () => {
    const scores = [
      parseFloat(nilaiKepribadian.kemampuanKerja) || 0,
      parseFloat(nilaiKepribadian.disiplinWaktu) || 0,
      parseFloat(nilaiKepribadian.kualitasKerja) || 0,
      parseFloat(nilaiKepribadian.inisiatif) || 0,
      parseFloat(nilaiKepribadian.perilaku) || 0,
    ].filter((score) => !isNaN(score)); // Filter out any NaN scores

    if (scores.length === 0) return 0; // Return 0 if there are no valid scores

    const total = scores.reduce((acc, score) => acc + score, 0);
    return (total / scores.length).toFixed(2); // Return average rounded to 2 decimal places
  };

  const getUser = async () => {
    try {
      const response = await Api.get(`/admin/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data.data || response.data.data.student.data);
      console.log("User data:", response.data.data);
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  };

  useEffect(() => {
    fetchNilai();
    fetchLeadDataProductivity();
    getUser();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-b-2 border-gray-900 rounded-full"
          role="status"
        ></div>
      </div>
    );
  }

  // Calculate average score for kepribadian
  const averageKepribadian = calculateAverageKepribadian();

  // Check if there are scores
  const hasNilaiKepribadian = Object.keys(nilaiKepribadian).length > 0;
  const hasNilaiProduktif =
    nilaiProduktif.scores && nilaiProduktif.scores.length > 0;

  const getNilaiHuruf = (nilai) => {
    if (nilai >= 80) return "A";
    if (nilai >= 70) return "B";
    if (nilai >= 60) return "C";
    if (nilai >= 0) return "D";
    return "E";
  };

  const getKualifikasi = (nilai) => {
    if (nilai >= 80) return "Sangat Baik";
    if (nilai >= 70) return "Baik";
    if (nilai >= 60) return "Cukup";
    if (nilai >= 0) return "Kurang";
    return "E";
  };

  // Fungsi untuk mengubah angka menjadi teks

  return (
    <div className="p-6 bg-gray-100 h-screen w-[800px] bg-white">
      <button
        onClick={exportToPDF}
        className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-auto"
      >
        Export PDF
      </button>
      <div
        id="rapot"
        className="bg-white shadow-md rounded-lg p-6 md:max-w-4xl max-w-4xl  mx-auto mb-4 " 
      >
        {/* Header */}
        <div className="flex items-center mb-6">
          <img
            src={smk} // Ganti dengan URL logo sekolah Anda
            alt="Logo Sekolah"
            className="w-22 h-20 mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold">SMK NEGERI 1 CIOMAS</h1>
            <p>Jl Raya Laladon Desa Laladon Ciomas</p>
            <p>Telp : ( 0251 ) 7520933, web : www.smkn1ciomas.sch.id</p>
            <p>Email : smkn1_ciomas@yahoo.co.id</p>
          </div>
        </div>
        <hr className="border-gray-300 mb-6" />
        {/* Body */}
        <div className="mt-6 mb-6 bg-blue-100 p-5 rounded-lg">
          <p className="text-center text-2xl font-bold">
            Penilain Hasil Praktik Kerja Lapangan
          </p>
        </div>
        <hr className="border-gray-300 mb-6" />

        <div className="mb-4">
  <table className=" w-[60%] text-lg">
    <tbody>
      <tr>
        <td className="font-semibold">Nama Siswa</td>
        <td className="font-bold ">: {profile.student?.name}</td>
      </tr>
      <tr>
        <td className="font-semibold">Kelas</td>
        <td className="font-bold">: {profile.student?.classes?.name}</td>
      </tr>
      <tr>
        <td className="font-semibold">Tempat Prakerin</td>
        <td className="font-bold">: {profile.student?.industries?.name}</td>
      </tr>
    </tbody>
  </table>
</div>


        <hr className="border-gray-300 mb-6" />
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2 b">Kepribadian</h2>
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-blue-500 text-white border border-gray-300">
                <th className="px-4 py-2 text-center">No</th>
                <th className="px-4 py-2 text-center">Aspek</th>
                <th className="px-4 py-2 text-center ">Nilai</th>
                <th className="px-4 py-2 text-center">Nilai Tertulis</th>
                <th className="px-4 py-2 text-center">Kualifikasi</th>
              </tr>
            </thead>
            <tbody>
              {hasNilaiKepribadian ? (
                <>
                  {[
                    {
                      label: "Kemampuan Kerja",
                      value: nilaiKepribadian.kemampuanKerja,
                    },
                    {
                      label: "Disiplin Waktu",
                      value: nilaiKepribadian.disiplinWaktu,
                    },
                    {
                      label: "Kualitas Kerja",
                      value: nilaiKepribadian.kualitasKerja,
                    },
                    { label: "Inisiatif", value: nilaiKepribadian.inisiatif },
                    { label: "Perilaku", value: nilaiKepribadian.perilaku },
                  ].map((item, index) => (
                    <tr
                      key={index}
                      className={`bg-${
                        index % 2 === 0 ? "white" : "gray-50"
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="border border-gray-300 text-center py-2 px-4 font-semibold">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 py-2 px-4 font-semibold">
                        {item.label}
                      </td>
                      <td className="border border-gray-300 text-center py-2 px-4 font-semibold">
                        {item.value}
                      </td>
                      <td className="border border-gray-300 text-center py-2 px-4 font-semibold">
                      {getNilaiHuruf(item.value)}
                      </td>
                      <td className="border border-gray-300 text-center py-2 px-4 font-semibold">
                        {getKualifikasi(item.value)}
                      </td>
                      {/* Nilai dalam teks */}
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { label: "Kemampuan Kerja" },
                    { label: "Disiplin Waktu" },
                    { label: "Kualitas Kerja" },
                    { label: "Inisiatif" },
                    { label: "Perilaku" },
                  ].map((item, index) => (
                    <tr
                      key={index}
                      className={`bg-${
                        index % 2 === 0 ? "white" : "gray-50"
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="border border-gray-300 text-center py-2 px-4 font-semibold">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 py-2 px-4 font-semibold">
                        {item.label}
                      </td>
                      <td className="border border-gray-300 text-center py-2 px-4 font-semibold">
                        Belum Ada Nilai
                      </td>
                      <td className="border border-gray-300 text-center py-2 px-4 font-semibold">
                        Belum Ada Nilai
                      </td>
                      <td className="border border-gray-300 text-center py-2 px-4 font-semibold">
                        Belum Ada Nilai
                      </td>{" "}
                      {/* Placeholder untuk teks */}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
          <table className="w-full text-left">
            <tbody>
              <tr className=" text-white border border-gray-300">
                <td className=" bg-blue-500 border border-gray-300 text-center py-2 px-4 font-semibold w-[75%]">
                  Total Rata-Rata Nilai Produktif
                </td>
                <td className="bg-blue-400 border border-gray-300 text-center py-2 px-4 font-semibold w-[33%]">
                  {averageKepribadian || "0.00"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Nilai Produktif</h2>
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-blue-500 text-white border border-gray-300">
                <th className="px-4 py-2 text-center">No</th>
                <th className="px-4 py-2 text-center">Mata Pelajaran</th>
                <th className="px-4 py-2 text-center">Nilai</th>
                <th className="px-4 py-2 text-center">Nilai Tertulis</th>
                <th className="px-4 py-2 text-center">Kualifikasi</th>
              </tr>
            </thead>
            <tbody>
              {hasNilaiProduktif ? (
                nilaiProduktif.scores.map((score, index) => (
                  <tr
                    key={index}
                    className="bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <td className="border border-gray-300 text-center py-2 px-4 font-semibold">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 py-2 px-4 font-semibold">
                      {score.name}
                    </td>
                    <td className="border border-gray-300 text-center py-2 px-4 font-semibold">
                      {score.score}
                    </td>
                    <td className="border border-gray-300 text-center py-2 px-4 font-semibold">
                    {getNilaiHuruf(score.score)}
                    </td>
                    <td className="border border-gray-300 text-center py-2 px-4 font-semibold">
                      {getKualifikasi(score.score)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white">
                  <td
                    className="border border-gray-300 text-center py-2 px-4 font-semibold"
                    colSpan="3"
                  >
                    Belum ada nilai produktif.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Tabel untuk total nilai produktif */}
          <table className="w-full text-left">
            <tbody>
              <tr className=" text-white border border-gray-300">
                <td className=" bg-blue-500 border border-gray-300 text-center py-2 px-4 font-semibold w-[75%]">
                  Total Rata-Rata Nilai Produktif
                </td>
                <td className="bg-blue-400 border border-gray-300 text-center py-2 px-4 font-semibold w-[33%]">
                  {nilaiProduktif.average_score || "0.00"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rapot;
