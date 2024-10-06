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
        username: "",
        name: "",
        nama: "",
        roles: "",
        gender: "",
        alamat: "",
        occupation: "",
        phoneNumber: "",
    });

    const fetchParentData = async () => {
        try {
            const response = await Api.get(`admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const user = response.data.data;
            setFormData({
                username: user.name || "",
                name: user.parent ? user.parent.nama : "",
                nama: user.parent ? user.parent.nama : "",
                roles: user.roles ? user.roles.join(", ") : "",
                gender: user.parent ? user.parent.gender : "",
                alamat: user.parent ? user.parent.alamat : "",
                occupation: user.parent ? user.parent.occupation : "",
                phoneNumber: user.parent ? user.parent.phoneNumber : "",
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
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Api.put(`admin/users/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token},`
                },
            });
            toast.success("User data updated successfully!", {
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
                    toast.error(`Failed to update user data: ${Object.values(errorMessages)[0][0]}`, {
                        position: "top-right",
                        duration: 4000,
                    });
                } else {
                    toast.error(`Failed to update user data: ${error.response.data.message || 'Please check the form fields.'}`, {
                        position: "top-right",
                        duration: 4000,
                    });
                }
            } else {
                console.error("Error updating user data:", error);
                toast.error("Failed to update user data.", {
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
                <h1 className="text-3xl font-bold text-center mb-4">Edit User Data</h1>
                <p className="text-center border-b pb-4 mb-4">Please update the form below!</p>

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

                    <div className="mb-4" hidden>
                        <label className="block text-gray-700 font-bold mb-2">Name</label>
                        <input
                            type="text"
                            name="nama"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4" hid>
                        <label className="block text-gray-700 font-bold mb-2">Name</label>
                        <input
                            type="text"
                            name="nama"
                            value={formData.nama}
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
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="laki">Laki-laki</option>
                            <option value="perempuan">Perempuan</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Address</label>
                        <textarea
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            rows="4"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Occupation</label>
                        <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
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
                            onClick={() => navigate('/app/data/oarngtua')}
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