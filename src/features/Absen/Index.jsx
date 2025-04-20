import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import swal from "sweetalert2";
import Cookies from "js-cookie";
import Api from "../../api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AbsenceForm = () => {
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [absenceType, setAbsenceType] = useState("masuk"); // State untuk tipe absen
  const [isAlreadyAbsent, setIsAlreadyAbsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const streamRef = useRef(null); // Ref untuk menyimpan stream kamera
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const token = Cookies.get("token");

  const checkAbsen = async () => {
    try {
      const response = await Api.get("admin/absen-cek", {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });

      const data = response.data.message;

      // Menentukan apakah absen masuk, pulang, atau sudah absen penuh
      if (data === "Masuk") {
        setAbsenceType("Masuk");
      } else if (data === "Pulang") {
        setAbsenceType("Pulang");
      } else if (
        data === "Anda sudah absen pulang hari ini, tidak bisa absen lagi."
      ) {
        setIsAlreadyAbsent(true);
        
      }
    } catch (error) {
      console.error("Error fetching absen status:", error);
    }
  };

  useEffect(() => {
    checkAbsen();
  }, []);

  // Update current time every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime({
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Enumerate video devices and set the default device
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    });
  }, []);

  // Start the camera when modal is shown
  useEffect(() => {
    if (showModal) {
      startCamera();
    }
  }, [showModal, selectedDeviceId]);

  // Reverse geocode to get the address from latitude and longitude
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      return response.data.display_name;
    } catch (error) {
      return "Alamat tidak ditemukan";
    }
  };

  // Handle getting the user's location
  const handleGetLocation = async () => {
    if (isAlreadyAbsent) {
      swal.fire({
        title: "Sudah Absen",
        text: "Anda sudah absen masuk dan pulang hari ini.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return; // Stop further execution if already absent
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const address = await reverseGeocode(lat, lon);
          setLocation({ latitude: lat, longitude: lon });

          // Update state
          setShowModal(true);

          // Log state after change
        },
        (error) => {
          toast.error(
            "Tidak dapat mengakses lokasi. Beri izin agar Anda bisa absen"
          );
        }
      );
    } else {
      toast.error("Geolocation tidak didukung oleh browser ini.");
    }
  };

  // Start the camera for capturing photo
  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { deviceId: selectedDeviceId } })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        streamRef.current = stream; // Simpan stream
  
        video.onloadedmetadata = () => {
          video.play();
          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;
        };
      })
      .catch(() => {
        toast.error("Tidak dapat mengakses kamera.");
      });
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };
  
  

  // Capture the photo from the video stream
  const handleCapturePhoto = () => {
    const video = videoRef.current;
    const context = canvasRef.current.getContext("2d");

    // Draw the video stream into the canvas using its natural dimensions
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    // Convert the canvas content to a data URL
    const dataUrl = canvasRef.current.toDataURL("image/jpeg");
    setPhoto(dataUrl);
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle submission of the attendance form
  const handleSubmit = async () => {
    if (!photo) {
      toast.error("Silakan ambil foto sebelum absen.");
      return; // Stop further execution if no photo
    }

    const result = await swal.fire({
      title: "Absen",
      text: "Apakah Anda yakin ingin absen?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, absen!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      const now = new Date();
      const formData = new FormData();
      formData.append("date", formatDate(now));
      formData.append(
        "time",
        formatTime(currentTime.hours, currentTime.minutes, currentTime.seconds)
      );
      formData.append("absenceReason", "hadir");
      formData.append("longitude", location ? location.longitude : null);
      formData.append("latitude", location ? location.latitude : null);

      if (photo) {
        const base64Data = photo.split(",")[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        formData.append("image", blob, "photo.jpg");
      }

      try {
        const apiUrl = "/admin/absence";
        const response = await Api.post(apiUrl, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success(response.data.message, {
          position: "top-right",
          text: "Absen berhasil Dikirim.",
          duration: 4000,
        });

        clearForm();
        setShowModal(false);
        stopCamera();
        await checkAbsen();
      
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;

        toast.error(`Gagal melakukan absen. ${errorMessage}`, {
          position: "top-right",
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Format time to HH:MM:SS
  const formatTime = (hours, minutes, seconds) => {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  // Reset the camera to capture a new photo
  const handleResetCamera = () => {
    setPhoto(null);
    startCamera();
  };

  const handleClearPhoto = () => {
    setPhoto(null);
  };

  useEffect(() => {}, [isAlreadyAbsent]);

  // Clear the form after submission
  const clearForm = () => {
    setLocation(null);
    setPhoto(null);
    stopCamera();
  };

  return (
    <>
     <div className="card-body mx-auto bg-base-100 dark:bg-[#1f2937] rounded-xl text-center mt-[90px] mb-[80px] md:mt-[100px] md:h-[540px] md:w-1/3 shadow-xl transition-transform duration-500 hover:scale-[1.02] w-[90%] sm:w-[80%]">
  {/* Heading */}
  <motion.h1
    className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white"
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    Absensi Siswa PKL
  </motion.h1>

  {/* Subtitle */}
  <motion.p
    className="text-sm md:text-lg mt-2 text-gray-600 dark:text-gray-300"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    {isAlreadyAbsent
      ? "Anda sudah absen masuk dan pulang"
      : absenceType === "Masuk"
      ? "Silakan Absen Masuk"
      : "Silakan Absen Pulang"}
  </motion.p>

  {/* Tombol Absen */}
  <motion.div
    className="mt-4 flex justify-center"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.5 }}
  >
    <button
      onClick={handleGetLocation}
      className={`flex items-center justify-center h-32 w-32 md:h-40 md:w-40 rounded-full text-white text-5xl shadow-md transition-all duration-300 ${
        isAlreadyAbsent
          ? "bg-gray-500 hover:bg-gray-600"
          : absenceType === "Pulang"
          ? "bg-yellow-500 hover:bg-yellow-600"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      <i className="fa-solid fa-bell"></i>
    </button>
  </motion.div>

  {/* Jam */}
  <motion.div
    className="flex justify-center mt-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.3 }}
  >
    <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg shadow-sm">
      {[currentTime.hours, currentTime.minutes, currentTime.seconds].map((val, i) => (
        <React.Fragment key={i}>
          <span className="font-mono text-xl md:text-2xl tracking-widest text-gray-800 dark:text-white">
            {val.toString().padStart(2, "0")}
          </span>
          {i < 2 && <span className="mx-1 text-xl text-gray-500">:</span>}
        </React.Fragment>
      ))}
      <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">WIB</span>
    </div>
  </motion.div>

  {/* Riwayat Absen */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
  >
    <Link
      to="/app/rekap-absensi"
      className="btn bg-green-500 hover:bg-green-700 text-white mt-6 px-6 py-2 text-sm md:text-base transition hover:scale-105"
    >
      Riwayat Absen
    </Link>
  </motion.div>
</div>


      {showModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-0">
    <div className="bg-white dark:bg-[#1c2229] w-full max-w-md rounded-xl shadow-lg p-5 relative">
      
      {/* Close Button */}
      <button
        onClick={() => {
          setShowModal(false);
          handleClearPhoto();
          stopCamera();
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
        aria-label="Tutup"
      >
        ✕
      </button>

      {/* Title */}
      <p className="text-lg md:text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">
        {isAlreadyAbsent
          ? "✅ Anda sudah absen"
          : absenceType === "Masuk"
          ? "🕘 Absen Masuk"
          : "🕔 Absen Pulang"}
      </p>

      {/* Kamera Select */}
      <div className="mb-4">
        <label htmlFor="camera-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          🎥 Pilih Kamera
        </label>
        <select
          id="camera-select"
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${devices.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* Kamera / Foto Preview */}
      {photo ? (
        <>
          <img
            src={photo}
            alt="Preview"
            className="rounded-md w-full object-cover mb-4 max-h-[280px]"
          />
          <button
            onClick={handleResetCamera}
            className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Ambil Ulang <i className="fa-solid fa-camera ml-2"></i>
          </button>
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            className="rounded-md w-full object-cover mb-4 max-h-[280px]"
          />
          <canvas ref={canvasRef} className="hidden" width={640} height={480}></canvas>
          <button
            onClick={handleCapturePhoto}
            className="w-full py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-white rounded-md hover:bg-blue-200 dark:hover:bg-blue-700 transition"
          >
            Ambil Foto <i className="fa-solid fa-camera ml-2"></i>
          </button>
        </>
      )}

      {/* Simpan */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:opacity-50"
      >
        {loading ? "Loading..." : "💾 Simpan"}
      </button>
    </div>
  </div>
)}


      <ToastContainer />
    </>
  );
};

export default AbsenceForm;
