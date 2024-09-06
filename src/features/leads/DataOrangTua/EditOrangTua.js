import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Api from '../../../api';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const token = Cookies.get('token');

const EditParentPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        user_id: "",
        nama: "",
        placeOfBirth: "",
        dateOfBirth: "",
        gender: "",
        alamat: "",
        occupation:"",
        phoneNumber:"",

    });

    const fetchParentData = async () => {
        try {
            const response = await Api.get(`admin/parent/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const parent = response.data.data;
            console.log(parent);
            setFormData({
                user_id: parent.user_id || "",
                nama: parent.users ? parent.users.name : "",
                placeOfBirth: parent.placeOfBirth || "",
                dateOfBirth: parent.dateOfBirth || "",
                gender: parent.gender || "",
                alamat: parent.alamat || "",
                occupation: parent.occupation || "",
                phoneNumber: parent.phoneNumber || "",
            });
        } catch (error) {
            console.error("Error fetching parent data:", error);
            toast.error("Failed to load parent data.", {
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
            await Api.put(`admin/parent/62`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Parent data updated successfully!", {
                position: "top-right",
                duration: 4000,
            });
            navigate('/app/data/orangtua');
        } catch (error) {
            if (error.response) {
                console.error("Error response data:", error.response.data);

                const errorMessages = error.response.data.errors;
                if (errorMessages) {
                    for (const [field, messages] of Object.entries(errorMessages)) {
                        console.error(`Field: ${field}, Errors: ${messages.join(', ')}`);
                    }
                    toast.error(`Failed to update parent data: ${Object.values(errorMessages)[0][0]}`, {
                        position: "top-right",
                        duration: 4000,
                    });
                } else {
                    toast.error(`Failed to update parent data: ${error.response.data.message || 'Please check the form fields.'}`, {
                        position: "top-right",
                        duration: 4000,
                    });
                }
            } else {
                console.error("Error updating parent data:", error);
                toast.error("Failed to update parent data.", {
                    position: "top-right",
                    duration: 4000,
                });
            }
        }
    };
    
    useEffect(() => {
        fetchParentData();
    }, [id]);
    
    return (
        <div className="container mx-auto my-10 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
                <h1 className="text-3xl font-bold text-center mb-4">Edit Data Orang Tua</h1>
                <p className="text-center border-b pb-4 mb-4">Silakan update form di bawah!</p>

                <form onSubmit={handleSubmit}>
                   

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Nama Orang Tua</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Jenis Kelamin</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Tempat Lahir</label>
                        <input
                            type="text"
                            name="placeOfBirth"
                            value={formData.placeOfBirth}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                        />
                    </div>

                   

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Alamat</label>
                        <textarea
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            rows="4"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Pekerjaan</label>
                        <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Nomer Telepon</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
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
                            onClick={() => navigate('/app/data/orangtua')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditParentPage;
