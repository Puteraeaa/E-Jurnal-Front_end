import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewLead } from '../leadSlice';
import { useNavigate } from 'react-router-dom';

const AddLeadPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        kelas: "",
        status: "Belum",
        tempatPkl: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addNewLead({ newLeadObj: formData }));
        navigate("/app/data/siswa"); // Redirect to the lead list page after submission
    };

    return (
        <div className="container mx-auto px-4 py-6"> {/* Same container width and padding as AddLeadPage for industries */}
            <h3 className="font-bold text-2xl sm:text-3xl text-center mb-6">Tambah Data Siswa</h3> {/* Consistent title */}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Nama:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Kelas:</label>
                    <input
                        type="text"
                        name="kelas"
                        value={formData.kelas}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Status:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                        required
                    >
                        <option value="Sedang">Sedang</option>
                        <option value="Belum">Belum</option>
                        <option value="Selesai">Selesai</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Tempat PKL:</label>
                    <input
                        type="text"
                        name="tempatPkl"
                        value={formData.tempatPkl}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="flex justify-between w-full gap-2">
                    <button type="submit" className="btn btn-primary w-1/2 md:w-1/2 sm:w-auto">Save</button>
                    <button type="button" className="btn border-black w-1/2 md:w-1/2 sm:w-auto" onClick={() => navigate("/app/data/siswa")}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddLeadPage;
