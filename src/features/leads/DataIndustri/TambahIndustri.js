import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../../../components/Map'; // Adjust import path as needed
import Api from '../../../api';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const token = Cookies.get('token');

const AddLeadPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        user_id: "",
        name: "",
        bidang: "",
        alamat: "",
        longitude: "",
        latitude: "",
        industryMentorName: "",
        industryMentorNo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Api.post('admin/industri', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Lead added successfully!", {
                position: "top-right",
                duration: 4000,
            });
            navigate('/app/data/industri');
        } catch (error) {
            if (error.response) {
                // Log the entire error response
                console.error("Error response data:", error.response.data);
    
                // Extract and display field-specific errors
                const errorMessages = error.response.data.errors;
                if (errorMessages) {
                    for (const [field, messages] of Object.entries(errorMessages)) {
                        console.error(`Field: ${field}, Errors: ${messages.join(', ')}`);
                    }
                    // Optionally, display the first error message
                    toast.error(`Failed to add lead: ${Object.values(errorMessages)[0][0]}`, {
                        position: "top-right",
                        duration: 4000,
                    });
                } else {
                    toast.error(`Failed to add lead: ${error.response.data.message || 'Please check the form fields.'}`, {
                        position: "top-right",
                        duration: 4000,
                    });
                }
            } else {
                console.error("Error adding lead:", error);
                toast.error("Failed to add lead.", {
                    position: "top-right",
                    duration: 4000,
                });
            }
        }
    };

    const handleAddLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData((prevData) => ({
                        ...prevData,
                        latitude: latitude.toFixed(6), // Formatting to 6 decimal places
                        longitude: longitude.toFixed(6),
                    }));
                    toast.success("Location added successfully!", {
                        position: "top-right",
                        duration: 4000,
                    });
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    toast.error("Failed to fetch location. Please enable location services.", {
                        position: "top-right",
                        duration: 4000,
                    });
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.", {
                position: "top-right",
                duration: 4000,
            });
        }
    };

    return (
        <div className="container mx-auto my-10 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
                <h1 className="text-3xl font-bold text-center mb-4">Tambah Data Industri</h1>
                <p className="text-center border-b pb-4 mb-4">Silakan isi form di bawah!</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">User ID</label>
                        <input
                            type="text"
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Nama Industri</label>
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
                        <label className="block text-gray-700 font-bold mb-2">Bidang</label>
                        <input
                            type="text"
                            name="bidang"
                            value={formData.bidang}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

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

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Longitude</label>
                        <input
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                            readOnly
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Latitude</label>
                        <input
                            type="text"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                            readOnly
                        />
                    </div>

                    <div className="mb-4">
                        <Map setLatLng={({ lat, lng }) => {
                            setFormData((prevData) => ({
                                ...prevData,
                                latitude: lat,
                                longitude: lng,
                            }));
                        }} />
                    </div>

                    <button
                        type="button"
                        className="w-full px-4 py-2 text-white bg-green-500 hover:bg-green-700 rounded-lg mb-4"
                        onClick={handleAddLocation}
                    >
                        Tambah lokasi dengan posisi anda saat ini
                    </button>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Pembimbing</label>
                        <input
                            type="text"
                            name="industryMentorName"
                            value={formData.industryMentorName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">No Pembimbing</label>
                        <input
                            type="text"
                            name="industryMentorNo"
                            value={formData.industryMentorNo}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
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
                            onClick={() => navigate('/app/data/industri')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLeadPage;
