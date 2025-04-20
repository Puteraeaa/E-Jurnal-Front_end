import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../../api";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const token = Cookies.get("token");

const EditTeacherPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(Cookies.get("user"));
  const id = user.id;
  const [jurusan, setJurusan] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    password_confirmation: "",
    roles: "guru",
    no_hp: "",
    departemen_id: ""
  });

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value
    }));
  };

  // Function to handle form submission for editing teacher data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await Api.put(`admin/users/${id}`, {
            ...formData,
            roles: formData.roles.split(", ").map(role => role.trim()), // Mengubah string roles kembali menjadi array
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success("Lead updated successfully!", {
            position: "top-right",
            duration: 4000,
        });
        navigate('/app/settings-profile');
    } catch (error) {
        if (error.response) {
            console.error("Error response data:", error.response.data);

            const errorMessages = error.response.data.errors;
            if (errorMessages) {
                const firstErrorMessage = Object.values(errorMessages)[0][0];
                toast.error(`Failed to update lead: ${firstErrorMessage}`, {
                    position: "top-right",
                    duration: 4000,
                });
            } else {
                toast.error(`Failed to update lead: ${error.response.data.message || 'Please check the form fields.'}`, {
                    position: "top-right",
                    duration: 4000,
                });
            }
        } else {
            console.error("Error updating lead:", error);
            toast.error("Failed to update lead.", {
                position: "top-right",
                duration: 4000,
            });
        }
    }
};

  // Fetch teacher data to edit
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await Api.get(`admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const teacher = response.data.data;

        setFormData({
          username: teacher.name || "",
          name: teacher.teacher?.name || "",
          password: "", // Leave password empty if not changing
          password_confirmation: "",
          roles: "guru", // Assuming role stays "guru"
          no_hp: teacher.teacher?.no_hp || "",
          departemen_id: teacher.teacher?.departemen_id || ""
        });
      } catch (error) {
        console.error("Failed to fetch teacher data:", error);
        toast.error("Failed to fetch teacher data", {
          position: "top-right",
          duration: 4000
        });
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await Api.get("admin/departemen", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data.data.data || [];
        setJurusan(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchTeacherData();
    fetchDepartments();
  }, [id]);

  return (
    <div className="container mx-auto my-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500 dark:bg-gray-800 dark:border-blue-300">
        <h1 className="text-3xl font-bold text-center mb-4 dark:text-white">Edit Data Guru</h1>
        <p className="text-center border-b pb-4 mb-4 dark:text-gray-400">
          Silakan ubah data di bawah ini!
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 dark:text-white">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 dark:text-white">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 dark:text-white">
              Password (Biarkan kosong jika tidak ingin mengubah)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 dark:text-white">
              Password Confirmation (Biarkan kosong jika tidak ingin mengubah)
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 dark:text-white">
              No Telephone
            </label>
            <input
              type="text"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 dark:text-white">
              Jurusan
            </label>
            <select
              name="departemen_id"
              value={formData.departemen_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            >
              <option value="">Pilih Jurusan</option>
              {jurusan.map((jurusan) => (
                <option key={jurusan.id} value={jurusan.id}>
                  {jurusan.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between gap-2">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-lg dark:bg-blue-300 dark:hover:bg-blue-600"
            >
              Simpan
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              onClick={() => navigate("/app/settings-profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherPage;
