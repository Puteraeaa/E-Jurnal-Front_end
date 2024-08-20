import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import swal from "sweetalert2";
import { Link } from "react-router-dom";
import Api from "../../api";
import Cookies from "js-cookie";

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
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const token = Cookies.get("token");

  const [industri, setIndustri] = useState([]);
  const user = JSON.parse(Cookies.get('user'));

  const getIndustri = async () => {
    try {
      const response = await Api.get(`admin/industri/${user.industri_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIndustri(response.data.data);
    } catch (error) {
      console.error('Error fetching industri:', error.message);
    }
  };

  useEffect(() => {
    getIndustri();
  }, []);

  // Function to update the current time every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime({
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    };

    updateClock(); // Initial call to set time immediately
    const intervalId = setInterval(updateClock, 1000); // Update time every second

    return () => clearInterval(intervalId);
  }, []);

  // Effect to fetch available video input devices (cameras)
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first camera
      }
    });
  }, []);

  // Effect to start the camera when the modal is shown
  useEffect(() => {
    if (showModal) {
      startCamera(); // Start the camera when modal is shown
    }
  }, [showModal, selectedDeviceId]);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      return response.data.display_name;
    } catch (error) {
      console.error("Error during reverse geocoding:", error.message);
      return "Alamat tidak ditemukan";
    }
  };

  const handleGetLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const address = await reverseGeocode(lat, lon);
        setLocation({
          latitude: lat,
          longitude: lon,
        });

        setShowModal(true); // Show the modal when location is obtained
      });
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { deviceId: selectedDeviceId } }) // Use selected device
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing webcam: ", err.message);
        toast.error("Tidak dapat mengakses kamera. Pastikan Anda memberi izin.");
      });
  };

  const handleCapturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const dataUrl = canvasRef.current.toDataURL("image/jpeg");
    setPhoto(dataUrl);
  };

  const handleSubmit = async () => {
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
      const newEntry = {
        date: new Date().toLocaleDateString(),
        departureTime: currentTime.hours + ":" + currentTime.minutes,
        arrivalTime: currentTime.hours + ":" + currentTime.minutes,
        absenceReason: 'hadir',
        longitude: location ? location.longitude : null,
        latitude: location ? location.latitude : null,
        image: photo,
      };

      console.log("Submitting the following data:", newEntry);

      try {
        // Check if all required fields are filled
        if (!newEntry.date || !newEntry.departureTime || !newEntry.arrivalTime || !newEntry.absenceReason || !newEntry.longitude || !newEntry.latitude || !newEntry.image) {
          console.error("Missing required fields:", newEntry);
          throw new Error('Required fields are missing');
        }

        const response = await Api.post('/admin/absence', newEntry, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        toast.success(response.data.message, {
          position: "top-right",
          duration: 4000,
        });

        console.log("Attendance data submitted successfully:", newEntry);
        clearForm();
        setShowModal(false);
      } catch (error) {
        console.error("Error submitting attendance:", error.response ? error.response.data : error.message);

        if (error.response && error.response.data) {
          console.log("Server response error details:", error.response.data);
          toast.error(`Gagal melakukan absen. ${error.response.data.message || "Periksa kembali input Anda."}`, {
            position: "top-right",
            duration: 4000,
          });
        } else {
          toast.error("Gagal melakukan absen. Periksa kembali input Anda.", {
            position: "top-right",
            duration: 4000,
          });
        }
      }
    }
  };

  const handleResetCamera = () => {
    setPhoto(null);
    startCamera();
  };

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

      <Link className="btn btn-primary mt-6 text-white mx-auto" to='/app/rekap-absensi'> Riwayat Absen</Link>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl cursor-pointer"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg md:text-3xl">Absen Siswa PKL</h3>

            <label htmlFor="camera-select" className="block mt-4">
              Pilih Kamera:
            </label>
            <select
              id="camera-select"
              className="mt-2 p-2 bg-gray-100 text-black-100 rounded-md"
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
                  className="mt-4 w-[1120px] h-[400px] mx-auto cursor-pointer"
                />
                <button
                  onClick={handleResetCamera}
                  className="mt-4 p-2 bg-yellow-500 text-white rounded-md w-[200px] md:text-xl md:hover:bg-yellow-700"
                >
                  Reset Camera
                </button>
              </>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  className="mt-4 w-[1920px] h-[400px] mx-auto object-cover cursor-pointer"
                ></video>
                <button
                  onClick={handleCapturePhoto}
                  className="mt-4 p-2 bg-gray-100 text-black-100 text-1xl rounded-md shadow-md"
                >
                  {photo ? "Take Again" : "Take Photo"}
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
                Submit
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
