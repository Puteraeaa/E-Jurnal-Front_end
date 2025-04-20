import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Api from "../../api"; // Adjust the import path as necessary
import Cookies from "js-cookie";
import hasAnyPermission from "../../utils/Permissions";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import smk from "../../assets/smk.png";


const LeadDetailPage = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [leadProductivity, setLeadProductivity] = useState(null);
  const toWords = require("angka-terbilang-ts").default;
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");
  const [dataSiswa, setDataSiswa] = useState();
  const [profile, setProfile] = useState({}); // Assuming you need this for student profile data
  const [nilaiKepribadian, setNilaiKepribadian] = useState({});
  const [nilaiProduktif, setNilaiProduktif] = useState({});
  const [averageKepribadian, setAverageKepribadian] = useState(0); 
    const [isExportHidden, setIsExportHidden] = useState(false);
    const [isExportloading, setIsExportloading] = useState(false);
      const elementRef = useRef();


    const handleExportToPDF = () => {
      setIsExportHidden(true); // Menyembunyikan elemen saat ekspor dimulai
      setIsExportloading(true);
      setTimeout(() => {
        handleExport();
      }, 1000);
      
      setTimeout(() => {
        setIsExportloading(false);
        setIsExportHidden(false);
      }, 3000);
    };
  
    const handleExport = () => {
      const element = document.getElementById("rapot");
      const pdfWidth = 210; // dalam mm
      const pdfHeight = 297; // dalam mm
      const aspectRatio = pdfWidth / pdfHeight;
  
      if (element) {
        html2canvas(element, {
          useCORS: true,
          scale: 2,
          removeContainer: true,
          backgroundColor: "#fff",
          onclone: (documentClone) => {
            const element = documentClone.getElementById("rapot");
            if (element) {
              element.style.border = "none"; // Pastikan border pada elemen utama dihapus
            }
            const allElements = documentClone.querySelectorAll('*'); // Seleksi semua elemen di dalam elemen #rapot
            allElements.forEach((el) => {
              el.style.border = "none"; // Hapus border dari semua elemen anak
            });
          }
          
        }).then((canvas) => {
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
  
          let exportWidth, exportHeight;
          if (canvasWidth / canvasHeight > aspectRatio) {
            exportWidth = pdfWidth;
            exportHeight = (canvasHeight / canvasWidth) * pdfWidth;
          } else {
            exportHeight = pdfHeight;
            exportWidth = (canvasWidth / canvasHeight) * pdfHeight;
          }
  
          const imgData = canvas.toDataURL("image/png");
  
          const pdf = new jsPDF("portrait", "mm", "a4");
          pdf.addImage(imgData, "PNG", 0, 0, exportWidth, exportHeight);
          pdf.save(`nilai pkl ${profile.student?.name} .pdf`);
  
          // Reset indikator setelah selesai ekspor
          setIsExportHidden(false);
        });
      }
    };

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

  

  useEffect(() => {
    const fetchLeadData = async () => {
      setLoading(true);
      try {
        const response = await Api.get(`admin/penilaian/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLead(response.data.data);
        setUserId(response.data.data.student_id);
        setNilaiKepribadian(response.data.data);
      } catch (error) {
        console.error("Error fetching lead data:", error);
        setError("Failed to fetch lead data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeadData();
  }, [id, token]);

  useEffect(() => {
    const fetchLeadDataSiswa = async () => {
      if (!lead) return; // Exit if lead data is not available
      try {
        const response = await Api.get(`admin/users/${lead.students?.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data.data); // Assuming this is where you want to set profile
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError("Failed to fetch student data");
      }
    };

    fetchLeadDataSiswa();
  }, [lead, token]);

  useEffect(() => {
    const fetchLeadDataProductivity = async () => {
      if (!userId) return; // Exit if userId is not available
      setLoading(true);
      try {
        const response = await Api.get(
          `/admin/aspek-produktif/per-siswa?student_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLeadProductivity(
          response.data.data.length > 0 ? response.data.data[0].scores : null
        );
        setNilaiProduktif(response.data.data.length > 0 ? response.data.data[0] : null);
      } catch (error) {
        console.error("Error fetching lead productivity data:", error);
        setError("Failed to fetch lead productivity data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeadDataProductivity();
  }, [userId, token]);

  useEffect(() => {
    // Assuming you have a function to calculate average
    const calculateAverageKepribadian = () => {
      const scores = [
        parseFloat(nilaiKepribadian.kemampuanKerja) || 0,
        parseFloat(nilaiKepribadian.disiplinWaktu) || 0,
        parseFloat(nilaiKepribadian.kualitasKerja) || 0,
        parseFloat(nilaiKepribadian.inisiatif) || 0,
        parseFloat(nilaiKepribadian.perilaku) || 0,
      ];
      const total = scores.reduce((acc, score) => acc + score, 0);
      const average = total / scores.length;
      setAverageKepribadian(average.toFixed(2));
    };

    if (Object.keys(nilaiKepribadian).length > 0) {
      calculateAverageKepribadian();
    }
  }, [nilaiKepribadian]);

  console.log("Nilai Kepribadian:", nilaiKepribadian);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const hasNilaiKepribadian = Object.keys(nilaiKepribadian).length > 0;
  const hasNilaiProduktif = nilaiProduktif.scores && nilaiProduktif.scores.length > 0;

    const gradientStyle = {
    animation: "gradientX 3s ease infinite",
    backgroundSize: "200% 200%",
    backgroundPosition: "100% 50%",
  };

  return (
    <>
    <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20 scrollbar-hide ${isExportloading ? "" : "hidden"}`} style={{ overflow: "hidden" }}>
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-white">
          Mohon tunggu, sedang mengunduh laporan...<span className="typing-animation">.</span><span className="typing-animation">.</span><span className="typing-animation">.</span>
        </p>
      </div>
    </div>

    <section className="container mx-auto my-10 px-4 relative" >
      <div className="bg-white dark:bg-[#1c2229] shadow-md rounded-lg p-6 mb-6">
        <p className="border-b pb-2 font-bold text-xl md:text-4xl text-center">
          <i className="fas fa-chart-pie dark:text-white text-blue-600"></i>{" "}
          Rekap Penilain
        </p>
        <p className="text-gray-600 font-semibold mt-2 dark:text-white text-center text-xs md:text-base">
         Penilain di tambahkan oleh pihak industri
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <a className="btn bg-blue-500 hover:bg-blue-600 text-white" onClick={handleExportToPDF}>Export PDF</a>
      </div>
      

      {/* Card untuk Tempat PKL dan Nilai Rata-Rata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-md p-6 rounded-lg dark:bg-[#1c2229] hover:shadow-2xl transition-all ease-in-out duration-300 hover:scale-105 hover:shadow-blue-400 dark:hover:shadow-white hover:z-5">
          <h4 className="text-lg font-bold mb-2 dark:text-white">Informasi Siswa</h4>
          <div className="divider"></div>
          <table className="w-full md:w-[100%] text-lg hover ">
    <tbody className="dark:text-white border-none">
      <tr>
        <td className="font-semibold md:text-lg text-sm ">Nama</td>
        <td className="font-bold md:text-lg text-sm ">: {profile.student?.name}</td>
      </tr>
      <tr>
        <td className="font-semibold md:text-lg text-sm">Kelas</td>
        <td className="font-bold md:text-lg text-sm">: {profile.student?.classes?.name}</td>
      </tr>
      <tr>
        <td className="font-semibold md:text-lg text-sm">Tempat Prakerin</td>
        <td className="font-bold md:text-lg text-sm">: {profile.student?.industries?.name}</td>
      </tr>
    </tbody>
  </table>
        </div>
        <div className="flex space-x-4">
  {/* Card Kepribadian */}
  <div className="relative bg-gradient-to-r from-slate-300 to-slate-500 animate-gradient-x shadow-lg p-6 rounded-lg flex-1 transform hover:scale-105 transition duration-300 ease-out hover:shadow-2xl hover:shadow-blue-400 hover:z-5" style={gradientStyle}>
    <div className="absolute -top-4 -right-4 bg-blue-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
      💡
    </div>
    <h4 className="text-sm md:text-lg font-bold mb-2 text-white lg:mb-4">
      Rata-Rata Kepribadian
    </h4>
    <p className="font-bold text-3xl md:text-[80px] text-center mt-2 md:mt-9 md:text-left text-white">
      {averageKepribadian || "Belum ada nilai rata-rata"}
    </p>
  </div>

  {/* Card Produktif */}
  <div className="relative bg-gradient-to-r from-slate-300 to-slate-500  shadow-lg p-6 rounded-lg flex-1 transform hover:scale-105 transition duration-300 ease-out hover:shadow-2xl hover:shadow-blue-400 hover:z-5" style={gradientStyle}>
    <div className="absolute -top-4 -right-4 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
      📊
    </div>
    <h4 className="text-sm md:text-lg font-bold mb-2 text-white">
      Rata-Rata Produktif
    </h4>
    <p className="font-bold text-3xl md:text-[80px] text-center mt-2 md:mt-9 md:text-left text-white">
      {nilaiProduktif?.average_score || "0.00"}
    </p>
  </div>
</div>

      </div>

      {/* Tabel Nilai Kepribadian */}
      <div className="mb-8">
      <h4 className="font-bold text-2xl mb-4 dark:text-white">A. Aspek Kepribadian</h4>
      <div className="md:w-full md:mr-4 md:mb-4 mb-0 overflow-y-auto flex flex-col md:flex-row md:justify-center" >
        <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-lg border-none">
          <thead>
            <tr className="bg-blue-200 text-gray-800 rounded-lg dark:text-white dark:bg-gray-900 dark:border-gray-700">
              <th className="border border-gray-300 py-3 px-4 font-bold">No</th>
              <th className="border border-gray-300 py-3 px-4 font-bold">Kemampuan</th>
              <th className="border border-gray-300 py-3 px-4 font-bold">Nilai</th>
              <th className="border border-gray-300 py-3 px-4 font-bold">Nilai Tertulis</th>
              <th className="border border-gray-300 py-3 px-4 font-bold">Kualifikasi</th>

            </tr>
          </thead>
          <tbody className="dark:text-white">
            {hasNilaiKepribadian ? (
              <>
                <tr className="bg-white hover:bg-gray-100 transition-colors dark:bg-gray-700">
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">1</td>
                  <td className="border border-gray-300 py-2 px-4 font-semibold">Kemampuan Kerja</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{nilaiKepribadian.kemampuanKerja}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold"> {getNilaiHuruf(nilaiKepribadian.kemampuanKerja)}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{getKualifikasi(nilaiKepribadian.kemampuanKerja)} </td>
                </tr>
                <tr className="bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-700">
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold ">2</td>
                  <td className="border border-gray-300 py-2 px-4 font-semibold">Disiplin Waktu</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{nilaiKepribadian.disiplinWaktu}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold"> {getNilaiHuruf(nilaiKepribadian.disiplinWaktu)}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{getKualifikasi(nilaiKepribadian.disiplinWaktu)}</td>
                </tr>
                <tr className="bg-white hover:bg-gray-100 transition-colors dark:bg-gray-700">
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">3</td>
                  <td className="border border-gray-300 py-2 px-4 font-semibold">Kualitas Kerja</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{nilaiKepribadian.kualitasKerja}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold"> {getNilaiHuruf(nilaiKepribadian.kualitasKerja)}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{getKualifikasi(nilaiKepribadian.kualitasKerja)}</td>
                </tr>
                <tr className="bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-700">
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">4</td>
                  <td className="border border-gray-300 py-2 px-4 font-semibold">Inisiatif</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{nilaiKepribadian.inisiatif}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold"> {getNilaiHuruf(nilaiKepribadian.inisiatif)}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold"> {getKualifikasi(nilaiKepribadian.inisiatif)}</td>
                </tr>
                <tr className="bg-white hover:bg-gray-100 transition-colors dark:bg-gray-700" >
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">5</td>
                  <td className="border border-gray-300 py-2 px-4 font-semibold">Perilaku</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{nilaiKepribadian.perilaku}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{getNilaiHuruf(nilaiKepribadian.perilaku)}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{getKualifikasi(nilaiKepribadian.perilaku)}</td>
                </tr>
              </>
            ) : (
                <>
                <tr className="bg-white hover:bg-gray-100 transition-colors dark:bg-gray-700">
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">1</td>
                  <td className="border border-gray-300 py-2 px-4 font-semibold">Kemampuan Kerja</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">Belum Ada Nilai </td>
                </tr>
                <tr className="bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-700">
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">2</td>
                  <td className="border border-gray-300 py-2 px-4 font-semibold">Disiplin Waktu</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">Belum Ada Nilai </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100 transition-colors dark:bg-gray-700">
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">3</td>
                  <td className="border border-gray-300 py-2 px-4 font-semibold">Kualitas Kerja</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">Belum Ada Nilai </td>
                </tr>
                <tr className="bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-700">
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">4</td>
                  <td className="border border-gray-300 py-2 px-4 font-semibold">Inisiatif</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">Belum Ada Nilai </td>
                </tr>
                <tr className="bg-white hover:bg-gray-100 transition-colors dark:bg-gray-700">
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">5</td>
                  <td className="border border-gray-300 py-2 px-4 font-semibold">Perilaku</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">Belum Ada Nilai </td>
                </tr>
                </>
            )}
          </tbody>
        </table>
      </div>
      </div>

      {/* Tabel Nilai Produktif */}
      <div className="mb-8">
        <h4 className="font-bold text-2xl mb-4 dark:text-white">B. Aspek Produktif</h4>
        <div className="md:w-full md:mr-4 md:mb-4 mb-0 overflow-y-auto flex flex-col md:flex-row md:justify-center" >
        <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-blue-200 text-gray-800 rounded-lg dark:bg-gray-900 dark:text-white">
              <th className="border border-gray-300 py-3 px-4 font-bold">No</th>
              <th className="border border-gray-300 py-3 px-4 font-bold">Kemampuan</th>
              <th className="border border-gray-300 py-3 px-4 font-bold">Nilai</th>
              <th className="border border-gray-300 py-3 px-4 font-bold">Nilai Tertulis</th>
              <th className="border border-gray-300 py-3 px-4 font-bold">Kualifikasi</th>
            </tr>
          </thead>
          <tbody>
            {hasNilaiProduktif ? (
              nilaiProduktif.scores.map((score, index) => (
                <tr key={index} className="bg-gray-50 hover:bg-gray-100 transition-colors dark:text-white dark:bg-gray-700">
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{index + 1}</td>
                  <td className="border border-gray-300 py-2 px-4 font-semibold">{score.name}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{score.score}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{getNilaiHuruf(score.score)}</td>
                  <td className="border border-gray-300 text-center py-2 px-4 font-semibold">{getKualifikasi(score.score)}</td>
                </tr>
              ))
            ) : (
              <tr className="bg-white dark:bg-gray-700">
                <td className="border border-gray-300 text-center py-2 px-4 font-semibold" colSpan="3">
                  Belum ada nilai produktif.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
      <div className="mt-6 card w-full p-6 bg-base-100 shadow-xl">
  <p className="text-lg font-semibold">Keterangan Nilai:</p>
  <ul className="list-disc ml-6 text-lg">
    <li>Nilai 80 - 100: <span className="font-bold text-green-600">A (Sangat Baik)</span></li>
    <li>Nilai 70 - 79: <span className="font-bold text-yellow-600">B (Baik)</span></li>
    <li>Nilai 60 - 69: <span className="font-bold text-orange-600">C (Cukup)</span></li>
    <li>Nilai 0 - 59: <span className="font-bold text-red-600">D (Kurang)</span></li>
  </ul>
</div>

    </section>

{/* PDVF*/}
<section
  ref={elementRef}
  id="rapot"
  className={`bg-white shadow-md rounded-lg p-6 md:max-w-4xl max-w-4xl mx-auto mb-4 relative z-30 w-[1000px] ${isExportHidden ? 'block' : 'hidden'}`}

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
<table className=" w-[60%] text-lg border-none">
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
</section>

</>

  );
};

export default LeadDetailPage;