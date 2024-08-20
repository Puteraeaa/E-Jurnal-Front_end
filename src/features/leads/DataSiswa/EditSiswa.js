import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const staticLeads = [
    {
        id: "01",
        name: "Putera Alfadri",
        email: "Utasuta@gmail.com",
        kelas: "11 PPLG 1",
        status: "Sedang",
        tempatPkl: "Sevel Light"
    },
    {
        id: "02",
        name: "Arya",
        email: "Arya@gmail.com",
        kelas: "11 PPLG 1",
        status: "Belum",
        tempatPkl: "-"
    },
];

const EditLeadPage = () => {
    const { id } = useParams(); // Get the lead ID from the URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', kelas: '', status: '', tempatPkl:'', });
    const lead = staticLeads.find((lead) => lead.id === id); // Find the lead by ID

    useEffect(() => {
        if (lead) {
            setFormData({ ...lead });
        } else {
            navigate('/404');
        }
    }, [lead, id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/app/data/siswa');
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h3 className="font-bold text-2xl sm:text-3xl text-center mb-6">Edit Data Siswa</h3>
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
                <div className="flex justify-between gap-2">
                    <button type="submit" className="btn btn-primary w-1/2">Save</button>
                    <button type="button" className="btn border-black w-1/2" onClick={() => navigate('/app/data/siswa')}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditLeadPage;
