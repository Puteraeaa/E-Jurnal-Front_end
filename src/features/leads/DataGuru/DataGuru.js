import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import TitleCard from "../../../components/Cards/TitleCard";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import LeadDetailsModal from "./DetailGuru";
import Api from "../../../api";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert2";
import template from '../../../assets/Template import-guru.xlsx';  
import CryptoJS from 'crypto-js';

const DataGuru = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 5, // Ensure itemsPerPage is consistent
        total: 0
    });
    const [selectedLead, setSelectedLead] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [guru, setGuru] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const token = Cookies.get("token");

    useEffect(() => {
        fetchData(currentPage, searchTerm);
    }, [currentPage, searchTerm]);




    const encryptId = (id) => {
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
    
        return encodeURIComponent(encrypted); // Encode hasil enkripsi agar valid di URL
    };

    const fetchData = async (pageNumber = 1, search = "") => {
        try {
            const response = await Api.get(`admin/teacher?page=${pageNumber}&search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setGuru(response.data.data.data);
       
            setPagination({
                currentPage: response.data.data.current_page,
                perPage: response.data.data.per_page,
                total: response.data.data.total
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

  

    
    const totalPages = Math.ceil(pagination.total / pagination.perPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const pages = [];
        const totalPages = Math.ceil(pagination.total / pagination.perPage);
        
        // Always show the first page
        pages.push(
          <button
            key={1}
            className={`join-item btn mr-1 ${pagination.currentPage === 1 ? "btn-active" : ""}`}
            onClick={() => handleClick(1)}
          >
            1
          </button>
        );
      
        // Show dots if needed
        if (pagination.currentPage > 3) {
          pages.push(
            <button key="prev-ellipsis" className="join-item btn btn-disabled mr-1">...</button>
          );
        }
      
        // Show pages around the current page
        const startPage = Math.max(2, pagination.currentPage - 1);
        const endPage = Math.min(totalPages - 1, pagination.currentPage + 1);
      
        for (let i = startPage; i <= endPage; i++) {
          pages.push(
            <button
              key={i}
              className={`join-item btn mr-1 ${pagination.currentPage === i ? "btn-active" : ""}`}
              onClick={() => handleClick(i)}
            >
              {i}
            </button>
          );
        }
      
        // Show dots if needed
        if (pagination.currentPage < totalPages - 2) {
          pages.push(
            <button key="next-ellipsis" className="join-item btn btn-disabled">...</button>
          );
        }
      
        // Always show the last page
        if (totalPages > 1) {
          pages.push(
            <button
              key={totalPages}
              className={`join-item btn ${pagination.currentPage === totalPages ? "btn-active" : ""}`}
              onClick={() => handleClick(totalPages)}
            >
              {totalPages}
            </button>
          );
    
          return <>{pages}</>;
        }
      }

  
    


    

      const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };
  

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            toast.error("No file selected.", {
                position: "top-right",
                duration: 4000,
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        setIsLoading(true);

        try {
            await Api.post("/admin/import", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            toast.success("File uploaded successfully!", {
                position: "top-right",
                duration: 4000,
            });
            fetchData(); // Refresh data after file upload
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Failed to upload file.", {
                position: "top-right",
                duration: 4000,
            });
        } finally {
            setIsLoading(false);
            setSelectedFile(null);
        }
    };

    const downloadTemplate = () => {
        const link = document.createElement('a');
        link.href = template;
        link.setAttribute('download', 'Template import-guru.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (leadId) => {
        try {
            const { isConfirmed } = await swal.fire({
                title: "Yakin?",
                text: "Apakah Anda yakin ingin menghapus data ini?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Hapus!",
            });

            if (isConfirmed) {
                const response = await Api.delete(`admin/users/${leadId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                toast.success(response.data.message, {
                    position: "top-right",
                    duration: 4000,
                });
                fetchData(currentPage);  
            }
        } catch (error) {
            console.error("Error deleting lead:", error);
            toast.error("Failed to delete lead.", {
                position: "top-right",
                duration: 4000,
            });
        }
    };

    return (
        <>
            <ToastContainer />
            <TitleCard 
                title={`Data Guru (${pagination.total})`} 
                topMargin="mt-2" 
                TopSideButtons={
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                        <input
                            type="text"
                            className="input input-bordered input-sm mb-4 sm:mb-0 sm:mr-4 w-full sm:w-auto"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <Link to="/app/data/guru/tambah">
                            <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto">
                                Add New
                            </button>
                        </Link>
                        <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto" onClick={() => document.getElementById('my_modal_5').showModal()}>
                            Import Excel
                        </button>
                    </div>
                }
            >
                <div className="overflow-x-auto w-full">
                    <table className="table w-full text-center">
                        <thead>
                            <tr>
                                <th className=" text-center">User ID</th>
                                <th>Nama Guru</th>
                                <th>Nomer Guru</th>
                                <th className="w-1/4 text-center">Pelajaran</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="text-center">Loading...</td>
                                </tr>
                            ) : (
                                guru.map((lead) => (
                                    <tr key={lead.id}>
                                        <td className="whitespace-normal break-words">{lead.id}</td>
                                        <td className="whitespace-normal break-words">{lead.name}</td>
                                        <td className="whitespace-normal break-words">{lead.no_hp}</td>
                                        <td className="whitespace-normal break-words max-w-xs">
                                            {lead.departements ? lead.departements.name : ""}
                                        </td>
                                        <td className="flex justify-center space-x-2 sm:space-x-4">
                                            <button className="btn btn-sm btn-square btn-warning" onClick={() => { setSelectedLead(lead); setIsDetailModalOpen(true); }}>
                                                <EyeIcon className="h-4 w-4" />
                                            </button>
                                            <Link to={`/app/data/guru/edit/${encryptId(lead.user_id)}`}>
                                                <button className="btn btn-sm btn-square btn-primary">
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                            </Link>
                                            <button className="btn btn-sm btn-square btn-error" onClick={() => handleDelete(lead.user_id)}>
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )  ) 
                            ) }
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4 gap-2">
                    {renderPagination()}
                </div>
            </TitleCard>

            {isDetailModalOpen && <LeadDetailsModal lead={selectedLead} onClose={() => setIsDetailModalOpen(false)} />}
            
            <dialog id="my_modal_5" className="modal">
                <form method="dialog" className="modal-box">
                    <h3 className="font-bold text-lg">Upload Excel Siswa</h3>
                    <p className="py-4">
                        Silahkan upload file Excel siswa pada field di bawah ini.
                    </p>
                    <a className="btn bg-red-500 text-white w-[150px] text-xs mb-3" href="https://drive.google.com/drive/folders/1heRByiuCHQ7YAxJE8Azr9NMajwF0MKzT?usp=sharing"  target="_blank" >Download Template</a>
                    <input
                        type="file"
                        className="file-input file-input-bordered w-full"
                        onChange={handleFileChange}
                    />
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleFileUpload}
                            disabled={isLoading}
                        >
                            {isLoading ? "Uploading..." : "Submit"}
                        </button>
                        <button className="btn">Close</button>
                    </div>
                </form>
            </dialog>
        </>
    );
};

export default DataGuru;
