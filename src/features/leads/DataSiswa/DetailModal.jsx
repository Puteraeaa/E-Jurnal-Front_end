import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../common/modalSlice';

const LeadDetailsModal = ({ lead, show, onClose }) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(closeModal());
        onClose();  
    };

    const getStatusClass = (status) => {
        if (status === "Sedang") return "badge badge-accent bg-green-500 text-white w-32 h-9 text-lg";
        if (status === "Belum") return "badge badge-secondary bg-red-500 w-32 h-9 text-lg";
        if (status === "Selesai") return "badge badge-primary bg-blue-500 w-32 h-9 text-lg";
        return "badge";
    };

    return (
        <div className={`modal modal-open overflow-y-auto`}>
            <div className="modal-box w-11/12 max-w-5xl h-auto p-6 relative bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <div className="absolute top-4 right-4 z-50">
                    <button
                        className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400"
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
                <div className="text-center mb-6">
                    <img
                        src={lead.image}
                        alt="Profile"
                        className="w-36 h-36 mx-auto rounded-full border-4 border-blue-500"
                    />
                    <h3 className="text-2xl font-semibold mt-4 dark:text-white">{lead.name}</h3>
                    <h5 className="text-gray-500 dark:text-gray-400 mt-2">{lead.email}</h5>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 mb-4 shadow rounded">
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">Info Dasar</h3>
                    <table className="w-full">
                        <tbody className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">Nama</td>
                                <td className="py-2 px-4">{lead.name}</td>
                            </tr>
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">NIS</td>
                                <td className="py-2 px-4">{lead.nis}</td>
                            </tr>
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">Kelas</td>
                                <td className="py-2 px-4">{lead.classes ? lead.classes.name : 'No Classroom'}</td>
                            </tr>
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">Tempat Lahir</td>
                                <td className="py-2 px-4">{lead.dateOfBirth}</td>
                            </tr>
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">Tanggal Lahir</td>
                                <td className="py-2 px-4">{lead.placeOfBirth}</td>
                            </tr>
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">Gender</td>
                                <td className="py-2 px-4">{lead.gender}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-white dark:bg-gray-700 p-4 shadow rounded mt-6">
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">Info Lainnya</h3>
                    <table className="w-full">
                        <tbody className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">Alama</td>
                                <td className="py-2 px-4">{lead.alamat}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-white dark:bg-gray-700 p-4 shadow rounded mt-6">
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">Info Tempat PKL</h3>
                    <table className="w-full">
                        <tbody className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">Nama Tempat PKL </td>
                                <td className="py-2 px-4">{lead.industries ? lead.industries.name : 'No Teacher'}</td>
                            </tr>
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">Bidang </td>
                                <td className="py-2 px-4">{lead.industries ? lead.industries.bidang : 'No Teacher'}</td>
                            </tr>
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">Alamat Tempat PKL </td>
                                <td className="py-2 px-4">{lead.industries ? lead.industries.alamat : 'No Teacher'}</td>
                            </tr>
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">Nama Pembimbing </td>
                                <td className="py-2 px-4">{lead.industries ? lead.industries.industryMentorName : 'No Telpon'}</td>
                            </tr>

                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">No Telepon Pembimbing </td>
                                <td className="py-2 px-4">{lead.industries ? lead.industries.industryMentorNo : 'No Telpon'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-white dark:bg-gray-700 p-4 shadow rounded mt-6">
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">Info Guru Pembimbing</h3>
                    <table className="w-full">
                        <tbody className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">Nama</td>
                                <td className="py-2 px-4">{lead.teachers ? lead.teachers.name : 'No Teacher'}</td>
                            </tr>
                            <tr className="border-b dark:border-gray-600">
                                <td className="py-2 px-4 font-medium dark:text-gray-300">No. Telepon</td>
                                <td className="py-2 px-4">{lead.teachers ? lead.teachers.no_hp : 'No Teacher'}</td>
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
