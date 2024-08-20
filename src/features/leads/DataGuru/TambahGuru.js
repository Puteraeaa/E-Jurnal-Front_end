import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewLead } from '../leadSlice';

const AddLeadPage = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        alamat: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addNewLead({ newLeadObj: formData }));
        // Redirect to the leads list or another appropriate page after submission
    };

    return (
        <div className="container mx-auto px-4 py-6"> {/* Adjusted width and padding */}
            <h3 className="font-bold text-2xl sm:text-3xl text-center mb-6">Tambah Data Guru</h3> {/* Updated title */}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4"> {/* Updated form container */}
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Nama Guru:</label> {/* Updated label */}
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
                    <label className="block mb-2 font-bold">Email Guru:</label> {/* Updated label */}
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
                    <button type="submit" className="btn btn-primary w-1/2">Save</button>
                    <button type="button" className="btn border-black w-1/2" onClick={() => window.history.back()}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddLeadPage;
