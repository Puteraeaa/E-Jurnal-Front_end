import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import swal from "sweetalert2";
import Cookies from "js-cookie";
import Api from "../../api";
import { Link } from "react-router-dom";

const AbsenceForm = () => {
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const token = Cookies.get("token");

  // Update current time every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime({
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
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
    // Log state before change

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
            "Tidak dapat mengakses lokasi. Pastikan Anda memberi izin."
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
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        toast.error(
          "Tidak dapat mengakses kamera. Pastikan Anda memberi izin."
        );
      });
  };

  // Capture the photo from the video stream
  const handleCapturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
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
    const result = await swal.fire({
      title: "Absen",
      text: "Apakah Anda yakin ingin absen?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, absen!"
    });

    if (result.isConfirmed) {
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
            "Content-Type": "multipart/form-data"
          }
        });

        toast.success(response.data.message, {
          position: "top-right",
          duration: 4000
        });

        clearForm();
        setShowModal(false);
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        

        toast.error(`Gagal melakukan absen. ${errorMessage}`, {
          position: "top-right",
          duration: 4000
        });
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

  // Clear the form after submission
  const clearForm = () => {
    setLocation(null);
    setPhoto(null);
  };

  return (
    <div className="card-body mx-auto bg-base-100 h-90 rounded-xl text-center mt-[90px] mb-[80px] md:mt-[100px] md:h-[500px] md:w-1/3">
      <h1 className="text-2xl font-bold mb-4 md:text-3xl md:mt-5">
        Absensi Siswa PKL
      </h1>
      <button
        onClick={handleGetLocation}
        className="p-2 bg-green-500 text-white hover:bg-green-700 h-[150px] w-[150px] mx-auto rounded-full md:mt-5 md:h-[200px] md:w-[180px]"
      >
        <i className="fa-solid fa-bell text-5xl md:text-7xl text-center"></i>
      </button>

      <div className="flex gap-1 justify-center mt-6">
        <div className="flex flex-col p-2 bg-white rounded-box text-black-content dark:bg-[#1c2229]">
          <span className="font-mono md:text-3xl text-2xl dark:text-white dark:bg-[#1c2229]">
            {currentTime.hours.toString().padStart(2, "0")} :
          </span>
        </div>
        <div className="flex flex-col p-2 bg-white rounded-box text-black-content dark:bg-[#1c2229]">
          <span className="font-mono md:text-3xl text-2xl dark:text-white dark:bg-[#1c2229]">
            {currentTime.minutes.toString().padStart(2, "0")} :
          </span>
        </div>
        <div className="flex flex-col p-2 bg-white rounded-box text-black-content dark:bg-[#1c2229]">
          <span className="font-mono md:text-3xl text-2xl dark:text-white dark:bg-[#1c2229]">
            {currentTime.seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <Link
        className="btn btn-primary mt-6 text-white mx-auto"
        to="/app/rekap-absensi"
      >
        {" "}
        Riwayat Absen
      </Link>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1c2229] p-6 rounded-lg shadow-lg w-11/12 md:w-1/3 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-400 text-2xl cursor-pointer"
            >
              ✕
            </button>
            <h2 className="font-bold text-lg md:text-3xl dark:text-white">Absen Siswa PKL</h2>

            <label htmlFor="camera-select" className="block mt-4 dark:text-white">
              Pilih Kamera:
            </label>
            <select
              id="camera-select"
              className="mt-2 p-2 bg-gray-100 text-black-100 dark:bg-gray-700  rounded-md cursor-pointer"
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              value={selectedDeviceId}
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${devices.indexOf(device) + 1}`}
                </option>
              ))}
            </select>

            {photo ? (
              <>
                <img
                  src={photo}
                  alt="Preview"
                  className="mt-4 w-full h-auto mx-auto cursor-pointer object-cover"
                />
                <button
                  onClick={handleResetCamera}
                  className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 text-black-100 text-1xl rounded-md shadow-md"
                >
                  {photo ? "Ambil Ulang" : "Ambil Foto"}
                  <i className="fa-solid fa-camera ml-2"></i>
                </button>
              </>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  className="mt-4 w-full h-auto mx-auto object-cover cursor-pointer"
                ></video>
                <button
                  onClick={handleCapturePhoto}
                  className="mt-4 p-2 bg-gray-100 text-black-100 text-1xl rounded-md shadow-md dark:bg-gray-700"
                >
                  {photo ? "Ambil Ulang" : "Ambil Foto"}
                  <i className="fa-solid fa-camera ml-2"></i>
                </button>
                <canvas ref={canvasRef} className="hidden"></canvas>
              </>
            )}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="mt-4 p-2 bg-blue-500 text-white rounded-md w-[200px] md:text-xl md:hover:bg-blue-700"
              >
                Absen
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AbsenceForm;
