import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Api from "../../api";
import schoolLogo from "../../assets/smk.png"; // Make sure to import your logo
import bgImage from "../../assets/back.jpg"; // Import the background image

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    if (Cookies.get("token")) {
      navigate("/app/dashboard");
    }
  }, [navigate]);

  const checkInternetConnection = () => {
    return navigator.onLine;
  };

  const login = async (e) => {
    e.preventDefault();
    
    if (!checkInternetConnection()) {
      toast.error("Tidak ada koneksi internet. Periksa jaringan Anda dan coba lagi.", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setIsSubmitDisabled(true);

    try {
      const response = await Api.post("/login", {
        name: username,
        password: password,
      });

      if (response.status === 200) {
        Cookies.set("token", response.data.token);
        Cookies.set("user", JSON.stringify(response.data.user));
        Cookies.set("permissions", JSON.stringify(response.data.permissions));

        toast.success("Login Berhasil!", {
          position: "top-right",
          autoClose: 4000,
        });

        navigate("/app/dashboard");
      } else {
        toast.error("Status respons tidak terduga: " + response.status, {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan";
      console.error("Error Response:", errorMessage);

     

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsSubmitDisabled(false);
    }
  };

  if (Cookies.get("token")) {
    navigate("/app/dashboard");
    return null;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${bgImage})` }} // Set the background image
    >
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg overflow-hidden w-full max-w-md">
        <div className="p-6 space-y-6">
          {/* School logo */}
          <div className="text-center">
            <img src={schoolLogo} alt="SMKN 1 Ciomas Logo" className="w-24 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-700 mt-4">
              E-Jurnal SMKN 1 Ciomas
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Sistem Digital untuk Praktik Kerja Lapangan
            </p>
          </div>

          <form onSubmit={login}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 focus:ring focus:ring-blue-300"
              disabled={isSubmitDisabled}
            >
              Login
            </button>
          </form>

          {/* <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline mt-4 block text-center"
          >
            Lupa Password?
          </Link> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
