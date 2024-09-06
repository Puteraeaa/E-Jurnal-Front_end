import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Api from '../../../api';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const AddParentPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        roles: "orang tua",
        password: "",
        password_confirmation: "",
        name: "",
        gender: "",
        alamat: "",
        occupation: "",
        phoneNumber: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if passwords match
        if (formData.password !== formData.password_confirmation) {
            toast.error("Password and confirmation do not match.", {
                position: "top-right",
                duration: 4000,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error("Authentication token not found.", {
                    position: "top-right",
                    duration: 4000,
                });
                return;
            }

            await Api.post('admin/users', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Parent data added successfully!", {
                position: "top-right",
                duration: 4000,
            });
            navigate('/app/data/orangtua');
        } catch (error) {
            if (error.response) {
                const errorMessages = error.response.data.errors;
                console.error("Error response data:", error.response.data);
                if (errorMessages) {
                    for (const [field, messages] of Object.entries(errorMessages)) {
                        toast.error(`Error in ${field}: ${messages.join(', ')}`, {
                            position: "top-right",
                            duration: 4000,
                        });
                    }
                } else {
                    toast.error(`Failed to add parent data: ${error.response.data.message || 'Please check the form fields.'}`, {
                        position: "top-right",
                        duration: 4000,
                    });
                }
            } else {
                toast.error("Failed to add parent data.", {
                    position: "top-right",
                    duration: 4000,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto my-10 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
                <h1 className="text-3xl font-bold text-center mb-4">Tambah Data Orang Tua</h1>
                <p className="text-center border-b pb-4 mb-4">Silakan isi form di bawah untuk menambah data orang tua!</p>

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
                        <label className="block text-gray-700 font-bold mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Konfirmasi Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
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
                        <label className="block text-gray-700 font-bold mb-2">Nomor Telepon</label>
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
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
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

export default AddParentPage;
