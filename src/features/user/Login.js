import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Api from "../../api"; // Ensure Api is correctly configured

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setIsSubmitDisabled(true);

    try {
      const response = await Api.post("/login", {
        name: username,
        password: password,
      });

      // Check if response is successful
      if (response.status === 200) {
        Cookies.set("token", response.data.token);
        Cookies.set("user", JSON.stringify(response.data.user));
        Cookies.set("permissions", JSON.stringify(response.data.permissions));

        toast.success("Login Successful!", {
          position: "top-right",
          autoClose: 4000,
        });

        navigate("/app/dashboard");
      } else {
        toast.error("Unexpected response status: " + response.status, {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
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
    return null; // Prevent rendering the login form if already logged in
  }

  return (
    <div className="dark:bg-gray-800">
      <div className="flex justify-center h-screen">
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{ backgroundImage: "linear-gradient(to right bottom, #3e7cda, #00a6dd, #4bc5ca, #a7ddc3, #eaf2d9)" }}
        >
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-4xl font-bold text-white dark:text-white  ">
                E-<span className="">Jurnal</span>
              </h2>
              <p className="max-w-xl mt-3 text-gray-300">
              E-Jurnal PKL (Praktik Kerja Lapangan) di SMKN 1 Ciomas adalah sistem digital yang digunakan oleh siswa yang sedang melaksanakan PKL untuk mencatat dan melaporkan kegiatan harian mereka selama periode PKL. Sistem ini menggantikan jurnal manual yang biasanya digunakan oleh siswa.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-center text-dark dark:text-white ">
                E-Jurnal
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-300">
                Sign in to access your account
              </p>
            </div>

            <div className="mt-8">
              <form onSubmit={login}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Username
                  </label>
                  <input
                    type="text" // Changed type from "username" to "text"
                    name="username"
                    id="username"
                    placeholder="Your Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="text-sm text-gray-600 dark:text-gray-200"
                    >
                      Password
                    </label>
                  </div>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your Password"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    disabled={isSubmitDisabled}
                  >
                    Sign in
                  </button>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline mt-3"
                  >
                    Forgot Password
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
