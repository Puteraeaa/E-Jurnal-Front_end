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
      <div className="modal-box w-full max-w-5xl h-auto p-8 relative bg-white dark:bg-gray-800 shadow-2xl rounded-xl transition-all ease-in-out duration-300 transform">
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
        
        <div className="text-center mb-8">
          <img
             src={ lead.image && lead.image !== "https://api.jurnal.pplgsmkn1ciomas.my.id/storage" 
              ? lead.image 
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }
            alt="Profile"
            className="w-36 h-36 mx-auto rounded-full border-4 border-blue-500 shadow-lg"
          />
          <h3 className="text-3xl font-bold mt-4 dark:text-white">{lead.name}</h3>
          <h5 className="text-gray-500 dark:text-gray-400 mt-2">{lead.email}</h5>
        </div>

        {/* Info Dasar Section */}
        <div className="bg-white dark:bg-gray-700 p-6 shadow-lg rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4 dark:text-white border-b pb-2">Data Siswa</h3>
          <table className="w-full">
            <tbody className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Nama</td>
                <td className="py-3 px-4 w-2/3">{lead.name}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">NIS</td>
                <td className="py-3 px-4 w-2/3">{lead.nis}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Kelas</td>
                <td className="py-3 px-4 w-2/3">{lead.classes ? lead.classes.name : 'No Classroom'}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Tempat Lahir</td>
                <td className="py-3 px-4 w-2/3">{lead.placeOfBirth}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Tanggal Lahir</td>
                <td className="py-3 px-4 w-2/3">{lead.dateOfBirth}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Gender</td>
                <td className="py-3 px-4 w-2/3">{lead.gender}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Info Orangtua Section */}
        <div className="bg-white dark:bg-gray-700 p-6 shadow-lg rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4 dark:text-white border-b pb-2">Data Orang Tua</h3>
          <table className="w-full">
            <tbody className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Nama Orang Tua</td>
                <td className="py-3 px-4 w-2/3">{lead.parents ? lead.parents.nama : 'No Industry'}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Jenis Kelamin</td>
                <td className="py-3 px-4 w-2/3">{lead.parents ? lead.parents.gender : 'No Industry'}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Alamat Orang Tua</td>
                <td className="py-3 px-4 w-2/3">{lead.parents ? lead.parents.alamat : 'No Address'}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Pekerjaan Orang Tua</td>
                <td className="py-3 px-4 w-2/3">{lead.parents ? lead.parents.occupation : 'No Mentor'}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">No Telepon Orang Tua</td>
                <td className="py-3 px-4 w-2/3">{lead.parents ? lead.parents.phoneNumber : 'No Phone'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Info Tempat PKL Section */}
        <div className="bg-white dark:bg-gray-700 p-6 shadow-lg rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4 dark:text-white border-b pb-2">Data Tempat PKL</h3>
          <table className="w-full">
            <tbody className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Nama Tempat PKL</td>
                <td className="py-3 px-4 w-2/3">{lead.industries ? lead.industries.name : 'No Industry'}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Bidang</td>
                <td className="py-3 px-4 w-2/3">{lead.industries ? lead.industries.bidang : 'No Industry'}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Alamat Tempat PKL</td>
                <td className="py-3 px-4 w-2/3">{lead.industries ? lead.industries.alamat : 'No Address'}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Nama Pembimbing</td>
                <td className="py-3 px-4 w-2/3">{lead.industries ? lead.industries.industryMentorName : 'No Mentor'}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">No Telepon Pembimbing</td>
                <td className="py-3 px-4 w-2/3">{lead.industries ? lead.industries.industryMentorNo : 'No Phone'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Info Guru Pembimbing Section */}
        <div className="bg-white dark:bg-gray-700 p-6 shadow-lg rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4 dark:text-white border-b pb-2">Data Guru Pembimbing</h3>
          <table className="w-full">
            <tbody className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">Nama</td>
                <td className="py-3 px-4 w-2/3">{lead.teachers ? lead.teachers.name : 'No Teacher'}</td>
              </tr>
              <tr className="border-b dark:border-gray-600">
                <td className="py-3 px-4 font-medium w-1/3">No. Telepon</td>
                <td className="py-3 px-4 w-2/3">{lead.teachers ? lead.teachers.no_hp : 'No Phone'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <div className="modal-action flex justify-center mt-8">
          <button
            className="btn btn-xl bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto px-10 py-2 rounded-lg shadow-lg transition duration-300"
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
