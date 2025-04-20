import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../../api";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import CryptoJS from "crypto-js";

const token = Cookies.get("token");

const EditStudentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const decryptId = (encryptedId) => {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const decoded = decodeURIComponent(encryptedId); 
    const bytes = CryptoJS.AES.decrypt(decoded, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const decryptedId = decryptId(id);

  const [jurusan, setJurusan] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    user_id: "",
    no_hp: "",
    departemen_id: "",
    roles: "guru",
  });

  const fetchTeacherData = async () => {
    try {
      const response = await Api.get(`admin/users/${decryptedId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const teacher = response.data.data.teacher;
      const username = response.data.data.name;
      setFormData({
        username: username || "",
        name: teacher.name || "",
        password: "", // Leave password empty if not changing
        password_confirmation: "",
        user_id: teacher.user_id || "",
        no_hp: teacher.no_hp || "",
        departemen_id: teacher.departemen_id || "",
        roles: "guru"
      });
    } catch (error) {
      toast.error("Failed to load student data.", {
        position: "top-right",
        duration: 4000
      });
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.put(`admin/users/${decryptedId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Lead updated successfully!", {
        position: "top-right",
        duration: 4000
      });
      navigate("/app/data/guru");
    } catch (error) {
      if (error.response) {
        const errorMessages = error.response.data.errors;
        console.error("Error response data:", error.response.data);
        if (errorMessages) {
          for (const [field, messages] of Object.entries(errorMessages)) {
          }
          toast.error(
            `Failed to update lead: ${Object.values(errorMessages)[0][0]}`,
            {
              position: "top-right",
              duration: 4000
            }
          );
        } else {
          toast.error(
            `Failed to update lead: ${
              error.response.data.message || "Please check the form fields."
            }`,
            {
              position: "top-right",
              duration: 4000
            }
          );
        }
      } else {
        toast.error("Failed to update lead.", {
          position: "top-right",
          duration: 4000
        });
      }
    }
  };

  const fetchDataAll = async () => {
    let allData = [];
    let pageNumber = 1;
    let totalPages = 1; 

    while (pageNumber <= totalPages) {
      const response = await Api.get(`admin/departemen?`, {
        params: {
          page: pageNumber,
          per_page: 100, // or set this to the max allowed per request
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response.data.data;
      const { current_page, last_page } = response.data.data;

      // Concatenate new data to allData array
      allData = [...allData, ...data];

      // Update pagination details
      pageNumber = current_page + 1;
      totalPages = last_page;
    }

   setJurusan(allData);
  };

  useEffect(() => {
    fetchDataAll();
  }, []);


  return (
    <div className="container mx-auto my-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
        <h1 className="text-3xl font-bold text-center mb-4">Edit Data guru</h1>
        <p className="text-center border-b pb-4 mb-4">
          Silakan update form di bawah!
        </p>

        <form onSubmit={handleSubmit}>
        <div className="mb-4" >
            <label className="block text-gray-700 font-bold mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Password (Biarkan kosong jika tidak ingin mengubah)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Password Confirmation (Biarkan kosong jika tidak ingin mengubah)
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
         

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              No Telephone
            </label>
            <input
              type="text"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Jurusan
            </label>
            <select
              name="departemen_id"
              value={formData.departemen_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
              className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
              onClick={() => navigate("/app/data/guru")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentPage;
