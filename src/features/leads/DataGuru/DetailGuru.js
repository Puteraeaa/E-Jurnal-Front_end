import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../common/modalSlice';

const LeadDetailsModal = ({ lead, onClose }) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(closeModal());
        onClose();  
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-5xl h-auto p-6 relative"> 
                <h3 className="font-bold text-2xl sm:text-3xl text-center mb-6">Detail Guru</h3> 
                <div className="py-4 text-lg gap-4">
                    <div className="mb-4">
                        <strong className="block sm:inline w-full sm:w-1/4">Nama Guru<span className='sm:ml-20'>:</span></strong>
                        <span className="block sm:inline w-full sm:w-3/4">{lead.name}</span>
                    </div>
                    <div className="mb-4">
                        <strong className="block sm:inline w-full sm:w-1/4">Email Guru<span className='sm:ml-20'>:</span></strong>
                        <span className="block sm:inline w-full sm:w-3/4">{lead.email}</span>
                    </div>
                    <div className="mb-4">
                        <strong className="block sm:inline w-full sm:w-1/4">Alamat<span className='sm:ml-28'>:</span></strong>
                        <span className="block sm:inline w-full sm:w-3/4">{lead.alamat}</span>
                    </div>
                </div>
                <div className="modal-action flex justify-center mt-6">
                    <button className="btn btn-sm sm:btn-md border-black w-full sm:w-auto" onClick={handleClose}>Close</button> 
                </div>
            </div>
        </div>
    );
};

export default LeadDetailsModal;
