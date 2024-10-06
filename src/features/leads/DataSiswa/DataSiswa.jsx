import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { getLeadsContent } from "../leadSlice";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import LeadDetailsModal from "./DetailModal";
import Api from "../../../api";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert2";
import template from '../../../assets/Template import-siswa.xlsx';
import hasAnyPermission from "../../../utils/Permissions";


function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            <td>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </td>
            <td>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </td>
            <td>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </td>
            <td>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </td>
            <td>
                <div className="h-8 bg-gray-200 rounded w-full mx-auto"></div>
            </td>
        </tr>
    );
}

const Leads = () => {
    
    const { leads, loading, error } = useSelector((state) => state.lead);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // For file upload
    const [selectedFile, setSelectedFile] = useState(null); // Track selected file
    const itemsPerPage = 5;
    const role = JSON.parse(Cookies.get("user")).roles;
    const [siswa, setSiswa] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 8,
        total: 0
    });
    const token = Cookies.get("token");

    const fetchData = async (pageNumber = 1) => {
        const page = pageNumber;

        let endpoint = '';

        if (role === "orang tua" || role === "guru" || role === "industri") {
            endpoint = `admin/Studentbyrole`;
        } else {
            endpoint = `admin/student`;
        }

        try {
            const response = await Api.get(`${endpoint}?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setSiswa(response.data.data.data);

            setPagination({
                currentPage: response.data.data.current_page,
                perPage: response.data.data.per_page,
                total: response.data.data.total
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    useEffect(() => {
        dispatch(getLeadsContent());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredLeads = siswa.filter((lead) =>
        lead.classes?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.industries?.name.toLowerCase().includes(searchTerm.toLowerCase())||
        lead.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteCurrentLead = (id) => {
        dispatch(openModal({
            title: "Confirmation",
            bodyType: "CONFIRMATION",
            extraObject: { message: `Are you sure you want to delete this lead?`, id }
        }));
    };

    const getStatusClass = (lead) => {
        if (lead.industries) return "badge badge-secondary badge-xs p-2 bg-green-500 border-green-500 w-20"; // Status is "Sedang"
        return "badge badge-secondary bg-red-500 w-20"; // Status is "Belum"
    };

    const viewLeadDetails = (lead) => {
        setSelectedLead(lead);
        setIsDetailModalOpen(true);
    };

    const totalPages = Math.ceil(pagination.total / itemsPerPage);

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
                fetchData(currentPage);  // Re-fetch data after deletion
            }
        } catch (error) {
            console.error("Error deleting lead:", error);
            toast.error("Failed to delete lead.", {
                position: "top-right",
                duration: 4000,
            });
        }
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

        setIsLoading(true); // Start loading

        try {
            const response = await Api.post("/admin/importStudent", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            toast.success("File uploaded successfully!", {
                position: "top-right",
                duration: 4000,
            });
            fetchData(currentPage);
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Failed to upload file.", {
                position: "top-right",
                duration: 4000,
            });
        } finally {
            setIsLoading(false); // Stop loading
            setSelectedFile(null); // Reset selected file
        }
    };

    const downloadData = async () => {
        try {
            // Confirm if the user wants to proceed with the download
            const { isConfirmed } = await swal.fire({
                title: "Yakin?",
                text: "Apakah Anda yakin ingin mengunduh data ini?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Unduh!",
                cancelButtonText: "Batal"
            });
    
            if (isConfirmed) {
                const response = await Api.get("/admin/export-users/siswa", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob' // Important for handling file downloads
                });
    
    
                // Create a link element to download the file
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'siswa_data.xlsx'); // Set the default file name
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Error downloading data:", error);
            toast.error("Failed to download data.", {
                position: "top-right",
                duration: 4000,
            });
        }
    };
    

    const downloadTemplate = () => {
        // Create a link element
        const link = document.createElement('a');
        link.href = template;
        link.setAttribute('download', 'Template import-siswa.xlsx'); // Set the filename for download
    
        // Append the link to the body
        document.body.appendChild(link);
    
        // Trigger the download by simulating a click
        link.click();
    
        // Remove the link element from the document
        document.body.removeChild(link);
    };
    
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <TitleCard title="Data Siswa" topMargin="mt-2" TopSideButtons={
               
                <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2">
                    
                        
                    <input
                        type="text"
                        className="input input-bordered input-sm w-full sm:w-64"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                     {hasAnyPermission(["siswa.delete"]) && (
                        <>
                    <Link to="/app/data/siswa/tambah">
                        <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto">Add New</button>
                    </Link>
                    <button className="btn btn-sm normal-case btn-warning w-full sm:w-auto" onClick={downloadData}>
                        Download All Data
                    </button>
                    <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto" onClick={() => document.getElementById('my_modal_5').showModal()}>
                        Import Excel
                    </button>
                    </>
                     )}
                </div>
               
            }>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full text-center">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Kelas</th>
                                <th>Status PKL</th>
                                <th>Tempat PKL</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <SkeletonRow />
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id}>
                                        <td>{lead.name}</td>
                                        <td>{lead.classes ? lead.classes.name : "-"}</td>
                                        <td>
                                            <div className={getStatusClass(lead)}> {lead.industries ? "Berlangsung" : "Belum"} </div>
                                        </td>
                                        <td>{lead.industries ? lead.industries.name : "-"}</td>
                                        <td>
                                            <div className="flex justify-center">   
                                                
                                            </div>
                                            <div className="flex items-center justify-center space-x-2">
                                            {hasAnyPermission(["siswa.delete"]) && (
                                            <Link to={`/app/data/siswa/edit/${lead.user_id}`}>
                                                    <button className="btn btn-sm btn-square btn-primary">
                                                        <PencilIcon className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                )}
                                                <button className="btn btn-sm btn-square btn-warning" onClick={() => viewLeadDetails(lead)}>
                                                <EyeIcon className="h-4 w-4" />
                                                </button>
                                                {hasAnyPermission(["siswa.delete"]) && (
                                                <button className="btn btn-sm btn-square btn-error" onClick={() => handleDelete(lead.user_id)}>
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                                  )}
                                            </div>
                                          
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            <div className="flex justify-center mt-4">
                {renderPagination()}
            </div>
            </TitleCard>
            <ToastContainer />
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

export default Leads;
