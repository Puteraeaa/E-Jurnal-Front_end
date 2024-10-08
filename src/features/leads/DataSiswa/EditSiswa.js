import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Api from '../../../api';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const token = Cookies.get('token');

const EditStudentPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [guru, setGuru] = useState([]);
    const [kelas, setKelas] = useState([]);
    const [jurusan, setJurusan] = useState([]);
    const [orangtua, setOrangTua] = useState([]);
    const [industries, setIndustries] = useState([]);

    const [formData, setFormData] = useState({
        user_id: "",
        username: "",
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
        teacher_id: "",
    });
    
    const fetchStudentData = async () => {
        try {
            const response = await Api.get(`admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const student = response.data.data.student;
            setFormData({
                user_id: student.user_id || "",
                username: response.data.data.name|| "",
                name: student.name || "",
                nis: student.nis || "",
                placeOfBirth: student.placeOfBirth || "",
                dateOfBirth: student.dateOfBirth || "",
                gender: student.gender || "",
                bloodType: student.bloodType || "",
                alamat: student.alamat || "",
                image: null,
                classes_id: student.classes_id || "",
                industri_id: student.industri_id || "",
                departemen_id: student.departemen_id || "",
                parents_id: student.parents_id || "",
                teacher_id: student.teacher_id || "",
                roles : "siswa",
            });
        } catch (error) {
            console.error("Error fetching student data:", error);
            toast.error("Failed to load student data.", {
                position: "top-right",
                duration: 4000,
            });
        }
    };
    
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Api.patch(`admin/users/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Lead updated successfully!", {
                position: "top-right",
                duration: 4000,
            });
            navigate('/app/data/siswa');
        } catch (error) {
            if (error.response) {
                console.error("Error response data:", error.response.data);
    
                const errorMessages = error.response.data.errors;
                if (errorMessages) {
                    for (const [field, messages] of Object.entries(errorMessages)) {
                        console.error(`Field: ${field}, Errors: ${messages.join(', ')}`);
                    }
                    toast.error(`Failed to update lead: ${Object.values(errorMessages)[0][0]}`, {
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
    

    const fetchIndustries = async () => {
        let allIndustries = [];
        let currentPage = 1;
        let totalPages = 1;

        try {
            while (currentPage <= totalPages) {
                const response = await Api.get(`admin/industri?page=${currentPage}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data.data.data || [];
                allIndustries = [...allIndustries, ...data];
                totalPages = response.data.data.last_page;
                currentPage++;
            }
            setIndustries(allIndustries);
        } catch (error) {
            setIndustries([]);
        }
    };

    const fetchOrangTua = async () => {
        let allParents = [];
        let currentPage = 1;
        let totalPages = 1;

        try {
            while (currentPage <= totalPages) {
                const response = await Api.get(`admin/parent?page=${currentPage}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data.data.data || [];
                allParents = [...allParents, ...data];
                totalPages = response.data.data.last_page;
                currentPage++;
            }
            setOrangTua(allParents);
        } catch (error) {
            setOrangTua([]);
        }
    };

    const fetchGuru = async () => {
        let allTeachers = [];
        let currentPage = 1;
        let totalPages = 1;

        try {
            while (currentPage <= totalPages) {
                const response = await Api.get(`admin/teacher?page=${currentPage}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data.data.data || [];
                allTeachers = [...allTeachers, ...data];
                totalPages = response.data.data.last_page;
                currentPage++;
            }
            setGuru(allTeachers);
        } catch (error) {
            setGuru([]);
        }
    };

    const fetchKelas = async () => {
        let allClasses = [];
        let currentPage = 1;
        let totalPages = 1;

        try {
            while (currentPage <= totalPages) {
                const response = await Api.get(`admin/classes?page=${currentPage}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data.data.data || [];
                allClasses = [...allClasses, ...data];
                totalPages = response.data.data.last_page;
                currentPage++;
            }
            setKelas(allClasses);
        } catch (error) {
            setKelas([]);
        }
    };

    const fetchJurusan = async () => {
        let allDepartments = [];
        let currentPage = 1;
        let totalPages = 1;

        try {
            while (currentPage <= totalPages) {
                const response = await Api.get(`admin/departemen?page=${currentPage}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data.data.data || [];
                allDepartments = [...allDepartments, ...data];
                totalPages = response.data.data.last_page;
                currentPage++;
            }
            setJurusan(allDepartments);
        } catch (error) {
            setJurusan([]);
        }
    };

    useEffect(() => {
        fetchStudentData();
        fetchIndustries();
        fetchGuru();
        fetchOrangTua();
        fetchKelas();
        fetchJurusan();
    }, [id]);



    return (
        <div className="container mx-auto my-10 px-4 dark:bg-gray-800">
            <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
                <h1 className="text-3xl font-bold text-center mb-4 dark:text-gray-100">Edit Data Siswa</h1>
                <p className="text-center border-b pb-4 mb-4 dark:text-white">Silakan update form di bawah!</p>

                <form onSubmit={handleSubmit}>


                <div className="mb-4">
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
                        <label className="block text-gray-700 font-bold mb-2">Nama Siswa</label>
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
                        <label className="block text-gray-700 font-bold mb-2">NIS</label>
                        <input
                            type="text"
                            name="nis"
                            value={formData.nis}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Tempat Lahir</label>
                        <input
                            type="text"
                            name="placeOfBirth"
                            value={formData.placeOfBirth}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Tanggal Lahir</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Jenis Kelamin</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="Laki-Laki">Laki-Laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Golongan Darah</label>
                        <select
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Pilih Golongan Darah</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="AB">AB</option>
                            <option value="O">O</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Alamat</label>
                        <textarea
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Pilih Kelas</label>
                        <select
                            name="classes_id"
                            value={formData.classes_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Pilih Kelas</option>
                            {kelas.map((kelasItem) => (
                                <option key={kelasItem.id} value={kelasItem.id}>
                                    {kelasItem.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Pilih Jurusan</label>
                        <select
                            name="departemen_id"
                            value={formData.departemen_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Pilih Jurusan</option>
                            {jurusan.map((jurusanItem) => (
                                <option key={jurusanItem.id} value={jurusanItem.id}>
                                    {jurusanItem.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Pilih Industri</label>
                        <select
                            name="industri_id"
                            value={formData.industri_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                           
                        >
                            <option value="">Pilih Industri</option>
                            {industries.map((industriItem) => (
                                <option key={industriItem.id} value={industriItem.id}>
                                    {industriItem.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Pilih Orang Tua</label>
                        <select
                            name="parent_id"
                            value={formData.parents_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Pilih Orang Tua</option>
                            {orangtua.map((parentItem) => (
                                <option key={parentItem.id} value={parentItem.id}>
                                    {parentItem.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Pilih Guru</label>
                        <select
                            name="teacher_id"
                            value={formData.teacher_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Pilih Guru</option>
                            {guru.map((teacherItem) => (
                                <option key={teacherItem.id} value={teacherItem.id}>
                                    {teacherItem.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Foto Siswa</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditStudentPage;
