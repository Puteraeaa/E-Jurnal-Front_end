import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../../api";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const token = Cookies.get("token");

const EditStudentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract the student ID from URL params

  const [jurusan, setJurusan] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    user_id: "",
    no_hp: "",
    departemen_id: ""
  });

  const fetchTeacherData = async () => {
    try {
      const response = await Api.get(`admin/teacher/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const teacher = response.data.data;
      setFormData({
        name: teacher.name || "",
        user_id: teacher.user_id || "",
        no_hp: teacher.no_hp || "",
        departemen_id: teacher.departemen_id || ""
      });
    } catch (error) {
      toast.error("Failed to load student data.", {
        position: "top-right",
        duration: 4000
      });
    }
    try {
      const response = await Api.get(`admin/teacher/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const teacher = response.data.data;
      setFormData({
        name: teacher.name || "",
        password: teacher.password || "",
        password_confirmation: teacher.password_confirmation || "",
        no_hp: teacher.no_hp || "",
        departemen_id: teacher.departemen_id || ""
      });
    } catch (error) {
      toast.error("Failed to load student data.", {
        position: "top-right",
        duration: 4000
      });
    }
  };

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
      await Api.put(`admin/student/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Lead updated successfully!", {
        position: "top-right",
        duration: 4000
      });
      navigate("/app/data/siswa");
    } catch (error) {
      if (error.response) {
        const errorMessages = error.response.data.errors;
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

  useEffect(() => {
    fetchTeacherData();
  }, [id]);

  useEffect(() => {
    Api.get("admin/departemen", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        const data = response.data.data.data || []; // Ensure the data is an array
        setJurusan(Array.isArray(data) ? data : []);
      })
      .catch((error) => {});
  }, []);

  return (
    <div className="container mx-auto my-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
        <h1 className="text-3xl font-bold text-center mb-4">Edit Data guru</h1>
        <p className="text-center border-b pb-4 mb-4">
          Silakan update form di bawah!
        </p>

        <form onSubmit={handleSubmit}>
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
          <div className="mb-4" hidden>
            <label className="block text-gray-700 font-bold mb-2">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.user}
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
