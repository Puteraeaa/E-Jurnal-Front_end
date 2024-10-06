import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../../api";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const AddStudentPage = () => {
  // State for form data
  const [formData, setFormData] = useState({
    roles: "siswa",
    username: "",
    password: "",
    password_confirmation: "",
    name: "",
    nis: "",
    placeOfBirth: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    alamat: "",
    image: null,
    classes_id: "",
    industri_id: "",
    departemen_id: "",
    parents_id: "",
    teacher_id: ""
  });

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State for managing submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for select options
  const [parent, setParents] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.trim() !== formData.password_confirmation.trim()) {
      toast.error("Password dan konfirmasi password tidak cocok.", {
        position: "top-right",
        duration: 4000
      });
      return;
    }

    setIsSubmitting(true); // Disable button

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "password_confirmation") {
          data.append(key, formData[key]);
        }
      });

      data.append("password_confirmation", formData.password_confirmation);

      await Api.post("admin/users", data, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Student added successfully!", {
        position: "top-right",
        duration: 4000
      });
      navigate("/app/data/siswa");
    } catch (error) {
      if (error.response) {
        const errorMessages = error.response.data.errors;
        if (errorMessages) {
          toast.error(
            `Failed to add student: ${Object.values(errorMessages)[0][0]}`,
            {
              position: "top-right",
              duration: 4000
            }
          );
        } else {
          toast.error(
            `Failed to add student: ${
              error.response.data.message || "Please check the form fields."
            }`,
            {
              position: "top-right",
              duration: 4000
            }
          );
        }
      } else {
        toast.error("Failed to add student.", {
          position: "top-right",
          duration: 4000
        });
      }
    } finally {
      setIsSubmitting(false); // Enable button after request
    }
  };

  // Fetch data (parents, industries, departments, classes, teachers)
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await Api.get("admin/parent", {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        });
        setParents(response.data.data.data || []);
      } catch (error) {
        console.error("Error fetching parents data:", error);
      }
    };

    const fetchIndustries = async () => {
      try {
        const response = await Api.get("admin/industri", {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        });
        setIndustries(response.data.data.data || []);
      } catch (error) {
        console.error("Error fetching industries data:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await Api.get("admin/departemen", {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        });
        setDepartments(response.data.data.data || []);
      } catch (error) {
        console.error("Error fetching departments data:", error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await Api.get("admin/classes", {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        });
        setClasses(response.data.data.data || []);
      } catch (error) {
        console.error("Error fetching classes data:", error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await Api.get("admin/teacher", {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        });
        setTeachers(response.data.data.data || []);
      } catch (error) {
        console.error("Error fetching teachers data:", error);
      }
    };

    fetchParents();
    fetchIndustries();
    fetchDepartments();
    fetchClasses();
    fetchTeachers();
  }, []);

  // Toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="container mx-auto my-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
        <h1 className="text-3xl font-bold text-center mb-4">
          Tambah Data Siswa
        </h1>
        <p className="text-center border-b pb-4 mb-4">
          Silakan isi form di bawah!
        </p>

        <form onSubmit={handleSubmit}>
        
          {/* Name field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Nama Siswa
            </label>
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
              username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Password field */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? (
                <i class="fa-solid fa-eye-slash"></i>
              ) : (
                <i class="fa-solid fa-eye"></i>
              )}
            </button>
          </div>

          {/* Password confirmation field */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-bold mb-2">
              Password Confirmation
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? (
                <i class="fa-solid fa-eye-slash"></i>
              ) : (
                <i class="fa-solid fa-eye"></i>
              )}
            </button>
          </div>

          {/* Other form fields */}
          {/* NIS field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">NIS</label>
            <input
              type="number"
              name="nis"
              value={formData.nis}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Place of Birth field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Tempat Lahir
            </label>
            <input
              type="text"
              name="placeOfBirth"
              value={formData.placeOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Date of Birth field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Tanggal Lahir
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Gender field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Jenis Kelamin
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value="" disabled>
                Pilih jenis kelamin
              </option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {/* Blood Type field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Golongan Darah
            </label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value="" disabled>
                Pilih golongan darah
              </option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>

          {/* Address field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Alamat</label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Profile Picture field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Foto Profil
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Select Parents */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Orang Tua/Wali
            </label>
            <select
              name="parents_id" // Gunakan nama yang sama seperti di state
              value={formData.parents_id} // Gunakan nilai yang benar dari formData
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Pilih Orang Tua/Wali</option>
              {parent.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Select Industries */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Industri
            </label>
            <select
              name="industri_id"
              value={formData.industri_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Pilih Industri</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Departments */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Departemen
            </label>
            <select
              name="departemen_id"
              value={formData.departemen_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Pilih Departemen</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Classes */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Kelas</label>
            <select
              name="classes_id"
              value={formData.classes_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Pilih Kelas</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Teachers */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Pembimbing
            </label>
            <select
              name="teacher_id"
              value={formData.teacher_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Pilih Pembimbing</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>


          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentPage;
