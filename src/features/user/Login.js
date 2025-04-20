import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Api from "../../api";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = process.env.REACT_APP_BASE_CMS_URL;

  const link = localStorage.getItem("logo");
  const link2 = localStorage.getItem("background");

  useEffect(() => {
    const fetchCms = async () => {
      try {
        const response = await Api.get("/settings");
        const newLogo = `${baseUrl}storage/${response.data.logo}`;
        const newBg = `${baseUrl}storage/${response.data.background}`;

        // Ambil logo dan background yang tersimpan di localStorage
        const savedLogo = localStorage.getItem("logo");
        const savedBg = localStorage.getItem("background");

        // Jika logo atau background berubah, update localStorage
        if (savedLogo !== newLogo) {
          localStorage.setItem("logo", newLogo);
        }
        if (savedBg !== newBg) {
          localStorage.setItem("background", newBg);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching CMS data:", error);
        setIsLoading(false);
      }
    };

    fetchCms();
  }, []);

  useEffect(() => {
    if (Cookies.get("token")) {
      navigate("/app/dashboard");
    }
  }, [navigate]);

  const checkInternetConnection = () => {
    return navigator.onLine;
  };

  const handleGoogleSuccess = (response) => {
    const googleIdToken = response.credential; // Mendapatkan ID token dari respons
    loginWithGoogle(googleIdToken); // Kirim ID token ke backend
    console.log("Google ID Token:", googleIdToken);
  };

  const handleGoogleFailure = (error) => {
    console.log("Google login error:", error);
  };

  const login = async (e) => {
    e.preventDefault();
    if (!checkInternetConnection()) {
      toast.error(
        "Tidak ada koneksi internet. Periksa jaringan Anda dan coba lagi.",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
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
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsSubmitDisabled(false);
    }
  };

  const loginWithGoogle = async (googleIdToken) => {
    // Check if the user is connected to the internet
    if (!checkInternetConnection()) {
      toast.error(
        "Tidak ada koneksi internet. Periksa jaringan Anda dan coba lagi.",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
      return;
    }

    try {
      // Send the Google ID token to the backend for authentication
      const response = await Api.post("/google/callback-login", {
        id_token: googleIdToken, // Send Google ID Token to backend
      });

      if (response.status === 200) {
        // Save token, user data, and permissions in Cookies
        Cookies.set("token", response.data.token);
        Cookies.set("user", JSON.stringify(response.data.user));
        Cookies.set("permissions", JSON.stringify(response.data.permissions));

        // Show success message
        toast.success("Login dengan Google berhasil!", {
          position: "top-right",
          autoClose: 4000,
        });

        // Navigate to the dashboard
        navigate("/app/dashboard");
      } else {
        toast.error("Status respons tidak terduga: " + response.status, {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error("Google login error:", error);

      // Extract error message safely
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat login dengan Google.";

      // Handle specific error when no account is linked with the Google account
      if (errorMessage === "No account linked with this Google account.") {
        toast.error(
          "Oops! Akun Google ini belum terhubung. Silakan hubungkan akun Google Anda melalui dashboard akun.",
          {
            position: "top-right",
            autoClose: 4000,
          }
        );
      }
    }
  };

  if (Cookies.get("token")) {
    navigate("/app/dashboard");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-300 border-dotted rounded-full animate-ping"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${link2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg overflow-hidden w-full max-w-lg z-10 relative">
        <div className="p-8 space-y-6">
          {/* School logo and title */}
          <div className="text-center">
            <img
              src={link}
              alt="SMKN 1 Ciomas Logo"
              className="w-[400px] mx-auto"
            />
            <p className="text-center text-sm text-gray-600 mt-[-15px]">
              Digitalisasi Praktik Kerja Lapangan SMKN 1 Ciomas
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={login}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 rounded-lg font-bold hover:from-blue-500 hover:to-blue-300 focus:ring focus:ring-blue-300 ${
                isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitDisabled}
            >
              Login
            </button>
          </form>

          {/* or */}
          <div className="flex items-center mt-4">
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <p className="mx-4 text-gray-500">OR</p>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
          </div>
          {/* Google Login Button */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
            render={({ onClick }) => (
              <button
                onClick={onClick}
                className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-400 text-white py-2 rounded-lg font-bold hover:from-red-500 hover:to-red-300 focus:ring focus:ring-red-300"
              >
                Login with Google
              </button>
            )}
          />

          <div className="flex items-center mt-2">
            <div className="flex-1 h-0.5 bg-gray-300"></div>
          </div>

          {/* Privacy Policy link */}
          <div className="text-center text-sm text-gray-600">
            <a
              href="https://pplgsmkn1ciomas.my.id/PrivacyPolicy.html"
              className="underline"
            >
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
