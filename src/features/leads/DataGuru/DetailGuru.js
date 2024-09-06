import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../common/modalSlice';

const LeadDetailsModal = ({ lead, show, onClose }) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(closeModal());
        onClose();  
    };

    return (
        <div className={`modal modal-open overflow-y-auto`}>
            <div className="modal-box w-11/12 max-w-5xl h-auto p-6 relative bg-white shadow-lg rounded-lg">
                <div className="absolute top-4 right-4 z-50">
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={handleClose}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="bg-white p-4 mb-4 shadow rounded">
                    <h3 className="text-lg font-semibold mb-6">Info Dasar</h3>
                    <table className="w-full">
                        <tbody className="text-sm font-medium text-gray-700">
                            <tr className="border-b">
                                <td className="py-2 px-4 font-medium">Nama</td>
                                <td className="py-2 px-4">{lead.name}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4 font-medium">Nomor Telepon</td>
                                <td className="py-2 px-4">{lead.no_hp}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4 font-medium">Jurusan</td>
                                <td className="py-2 px-4">{lead.departemen_id }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            
                <div className="modal-action flex justify-center mt-6">
                    <button
                        className="btn btn-sm sm:btn-md border-black w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadDetailsModal;
