import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../../api';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const token = Cookies.get('token');

const AddTeacherPage = () => {
    const navigate = useNavigate();
    const [jurusan, setJurusan] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        password_confirmation: "",
        roles: "guru", // Force the role to "guru"
        no_hp: "",
        departemen_id: "",
    });

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
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            await Api.post('admin/users', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Teacher added successfully!", {
                position: "top-right",
                duration: 4000,
            });
            navigate('/app/data/guru');
        } catch (error) {
            if (error.response) {
                const errorMessages = error.response.data.errors;
                if (errorMessages) {
                    for (const [field, messages] of Object.entries(errorMessages)) {
                       
                    }
                    toast.error(`Failed to add teacher: ${Object.values(errorMessages)[0][0]}`, {
                        position: "top-right",
                        duration: 4000,
                    });
                } else {
                    toast.error(`Failed to add teacher: ${error.response.data.message || 'Please check the form fields.'}`, {
                        position: "top-right",
                        duration: 4000,
                    });
                }
            } else {
               
                toast.error("Failed to add teacher.", {
                    position: "top-right",
                    duration: 4000,
                });
            }
        }
    };

    useEffect(() => {
        Api.get("admin/departemen", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const data = response.data.data.data || []; // Ensure the data is an array
            setJurusan(Array.isArray(data) ? data : []);

        })
      
    }, [token]);

    return (
        <div className="container mx-auto my-10 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
                <h1 className="text-3xl font-bold text-center mb-4">Tambah Data Guru</h1>
                <p className="text-center border-b pb-4 mb-4">Silakan isi form di bawah!</p>

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

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Password</label>
                        <input
                            type="text"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Password Confirmation</label>
                        <input
                            type="text"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Roles</label>
                        <input
                            type="text"
                            name="roles"
                            value={formData.roles}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">No Telephone</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Jurusan</label>
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
                            onClick={() => navigate('/app/data/guru')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTeacherPage;
