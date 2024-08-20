import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../common/modalSlice';
import { updateLead } from '../leadSlice';

const EditLeadModal = ({ lead, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ ...lead });

    useEffect(() => {
        setFormData({ ...lead });
    }, [lead]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateLead(formData));
        dispatch(closeModal());
        onClose();
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-5xl h-auto p-6 relative"> {/* Responsif dan padding */}
                <h3 className="font-bold text-2xl sm:text-3xl text-center mb-6">Edit Data Siswa</h3> {/* Judul sesuai */}
                <form onSubmit={handleSubmit} className="py-4 text-lg gap-4">
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
                    <div className="modal-action flex justify-between w-full gap-2">
                        <button type="submit" className="btn btn-primary w-1/2 md:w-1/2 sm:w-auto">Save</button>
                        <button type="button" className="btn border-black w-1/2 md:w-1/2 sm:w-auto" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLeadModal;
