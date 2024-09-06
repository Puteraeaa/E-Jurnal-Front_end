import React, { useState, useEffect } from 'react';
import { json, useNavigate, useParams } from 'react-router-dom';
import Api from '../../../api';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const token = Cookies.get('token');

const user = JSON.parse(Cookies.get("user"));
console.log('p',user);

const EditStudentPage = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const { id } = useParams(); // Extract the student ID from URL params

    const [formData, setFormData] = useState({
        user_id: "",
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
        const id = user.id;
      
        try {
            const response = await Api.get(`admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const student = response.data.data.student;
            setUserId(student.user_id)
            console.log(student);
            
            setFormData({
                user_id: student.user_id || "",
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

    useEffect(() => {
        fetchStudentData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        const id = user.id;
        e.preventDefault();
    
        // Log the form data before submitting
        console.log("Form data to be submitted:", formData);
    
        try {
            await Api.put(`admin/users/${userId}`, formData, {
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
    

  
    

   

    return (
        <div className="container mx-auto my-10 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
                <h1 className="text-3xl font-bold text-center mb-4">Edit Data Siswa</h1>
                <p className="text-center border-b pb-4 mb-4">Silakan update form di bawah!</p>

                <form onSubmit={handleSubmit}>

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
                            <option value="male">Laki-Laki</option>
                            <option value="female">Perempuan</option>
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
