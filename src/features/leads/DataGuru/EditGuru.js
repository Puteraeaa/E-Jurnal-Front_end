import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const staticLeads = [
    {
        id: "01",
        name: "Budi Santoso",
        email: "budisantoso@gmail.com",
        alamat: "Jl. Pendidikan No. 23, Jakarta"
    },
    {
        id: "02",
        name: "Joko",
        email: "Joko.owi@gmail.com",
        alamat: "Jl. Kebon Jeruk No. 45, Bandung"
    },
];

const EditLeadPage = () => {
    const { id } = useParams(); // Get the lead ID from the URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', alamat: '' });
    const lead = staticLeads.find((lead) => lead.id === id); // Find the lead by ID

    useEffect(() => {
        if (lead) {
            setFormData({ ...lead });
        } else {
            // Handle case where the lead is not found
            // e.g., navigate to a 404 page or show an error message
            navigate('/404');
        }
    }, [lead, id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Update the lead data logic here
        // Since staticLeads is a constant, you would need a way to update this data
        // For now, navigate back after submitting
        navigate('/data/guru');
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h3 className="font-bold text-2xl sm:text-3xl text-center mb-6">Edit Data Guru</h3>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Nama Guru:</label>
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
                    <label className="block mb-2 font-bold">Email Guru:</label>
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
                    <label className="block mb-2 font-bold">Alamat:</label>
                    <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                        required
                    />
                </div>
                <div className="flex justify-between gap-2">
                    <button type="submit" className="btn btn-primary w-1/2" onClick={() => navigate('/app/data/guru')}>Save</button>
                    <button type="button" className="btn border-black w-1/2" onClick={() => navigate('/app/data/guru')}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditLeadPage;
