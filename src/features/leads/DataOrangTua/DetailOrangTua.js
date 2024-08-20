import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../common/modalSlice';

const LeadDetailsModal = ({ lead, onClose }) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(closeModal());
        onClose();  // Call the onClose callback to clear the selected lead
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-5xl h-auto p-6 relative"> {/* Adjusted height and padding */}
                <h3 className="font-bold text-2xl sm:text-3xl text-center mb-6">Detail Orang Tua</h3> {/* Responsive font size */}
                <div className="py-4 text-lg gap-4">
                    <div className="mb-4">
                        <strong className="block sm:inline w-full sm:w-1/4">Nama Orang Tua<span className='sm:ml-14'>:</span></strong>
                        <span className="block sm:inline w-full sm:w-3/4">{lead.name}</span>
                    </div>
                    <div className="mb-4">
                        <strong className="block sm:inline w-full sm:w-1/4">Email Orang Tua<span className='sm:ml-14'>:</span></strong>
                        <span className="block sm:inline w-full sm:w-3/4">{lead.email}</span>
                    </div>
                    <div className="mb-4">
                        <strong className="block sm:inline w-full sm:w-1/4">Nama Anak<span className=' sm:ml-24'>:</span></strong>
                        <span className="block sm:inline w-full sm:w-3/4">{lead.namaAnak}</span>
                    </div>
                </div>
                <div className="modal-action flex justify-center mt-6">
                    <button className="btn btn-sm sm:btn-md border-black w-full sm:w-auto" onClick={handleClose}>Close</button> {/* Responsive button size */}
                </div>
            </div>
        </div>
    );
};

export default LeadDetailsModal;
