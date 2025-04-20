import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Map from '../../../components/Map'; // Sesuaikan path impor jika diperlukan
import Api from '../../../api';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import CryptoJS from 'crypto-js';

const token = Cookies.get('token');

const EditLeadPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [idUser, setId] = useState(""); // Mengambil parameter id dari route
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        bidang: "",
        alamat: "",
        longitude: "",
        latitude: "",
        industryMentorName: "",
        industryMentorNo: "",
        roles: "industri",
    });


     const decryptId = (encryptedId) => {
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const decoded = decodeURIComponent(encryptedId); 
        const bytes = CryptoJS.AES.decrypt(decoded, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    };
    
    const decryptedId = decryptId(id);

    useEffect(() => {
        // Mengambil data industri ketika komponen dimuat
        const fetchLeadData = async () => {
            try {
                const response = await Api.get (`admin/industri/${decryptedId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setId(response.data.data.user_id);
                if (response.data && response.data.data) {
                    const industries = response.data.data;
                    setFormData({
                        username: industries?.users?.name || "",
                        name: industries.name || "",
                        bidang: industries?.bidang || "",
                        alamat: industries?.alamat || "",
                        longitude: industries?.longitude || "",
                        latitude: industries?.latitude || "",
                        industryMentorName: industries?.industryMentorName || "",
                        industryMentorNo: industries?.industryMentorNo || "",
                        roles: "industri",
                    });
                } else {
                    console.error("Unexpected response structure:", response.data);
                    toast.error("gagal mengambil data", {
                        position: "top-right",
                        duration: 4000,
                    });
                }
            } catch (error) {
                console.error("Error fetching lead data:", error);
                toast.error("gagal mengambil data", {
                    position: "top-right",
                    duration: 4000,
                });
            }
        };

        fetchLeadData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Api.put(`admin/users/${idUser}`, {
                ...formData,
                roles: "industri",
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("berhasil mengubah data", {
                position: "top-right",
                duration: 4000,
            });
            navigate('/app/data/industri');
        } catch (error) {
            if (error.response) {
                console.error("Error response data:", error.response.data);

                const errorMessages = error.response.data.errors;
                if (errorMessages) {
                    const firstErrorMessage = Object.values(errorMessages)[0][0];
                    toast.error(`Failed to update lead: ${firstErrorMessage}`, {
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

    const handleSetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData((prevData) => ({
                        ...prevData,
                        latitude: latitude.toFixed(6),
                        longitude: longitude.toFixed(6),
                    }));
                    toast.success("Location updated successfully!", {
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

    const { username, name, bidang, alamat, longitude, latitude, industryMentorName, industryMentorNo, roles } = formData;

    return (
        <div className="container mx-auto my-10 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
                <h1 className="text-3xl font-bold text-center mb-4">Edit Data Industri</h1>
                <p className="text-center border-b pb-4 mb-4">Silakan edit form di bawah!</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
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
                            value={name}
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
                            value={bidang}
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
                            value={alamat}
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
                            value={longitude}
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
                            value={latitude}
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
                        onClick={handleSetCurrentLocation}
                    >
                        Tambah lokasi dengan posisi anda saat ini
                    </button>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Pembimbing</label>
                        <input
                            type="text"
                            name="industryMentorName"
                            value={industryMentorName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">No. Pembimbing</label>
                        <input
                            type="text"
                            name="industryMentorNo"
                            value={industryMentorNo}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4" hidden>
                        <label className="block text-gray-700 font-bold mb-2">Roles</label>
                        <input
                            type="text"
                            name="roles"
                            value={roles}
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

export default EditLeadPage;