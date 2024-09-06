import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { getLeadsContent } from "../leadSlice";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import LeadDetailsModal from "./DetailModal";
import Api from "../../../api";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert2";
import template from "../../../assets/Template import-siswa.xlsx";

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
            console.log("API Response Data:", response.data);

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
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteCurrentLead = (id) => {
        dispatch(openModal({
            title: "Confirmation",
            bodyType: "CONFIRMATION",
            extraObject: { message: `Are you sure you want to delete this lead?`, id }
        }));
    };

    const getStatusClass = (lead) => {
        if (lead.industries) return "badge badge-secondary bg-green-500 border-green-500 w-20"; // Status is "Sedang"
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
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`btn btn-sm ${i === currentPage ? "btn-active" : ""}`}
                    onClick={() => handleClick(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
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
            const response = await Api.post("/admin/import", formData, {
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
                const response = await Api.get("/admin/export-users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob' // Important for handling file downloads
                });
    
                console.log("API Response Data:", response.data);
    
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
        // Update the URL to the location where your template file is hosted
        const templateUrl = "../../../assets/Template import-siswa.xlsx"; // Adjust this path
    
        // Open the template URL in a new tab or download it directly
        window.open(templateUrl, "_blank");
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
                    <Link to="/app/data/siswa/tambah">
                        <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto">Add New</button>
                    </Link>
                    <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto" onClick={downloadData}>
                        Download All Data
                    </button>
                    <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto" onClick={() => document.getElementById('my_modal_5').showModal()}>
                        Import Excel
                    </button>
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
                                siswa.map((lead) => (
                                    <tr key={lead.id}>
                                        <td>{lead.name}</td>
                                        <td>{lead.class}</td>
                                        <td>
                                            <div className={getStatusClass(lead)}>{lead.industries ? "Sedang" : "Belum"}</div>
                                        </td>
                                        <td>{lead.industries ? lead.industries.name : "-"}</td>
                                        <td>
                                            <div className="flex items-center justify-center space-x-2">
                                                <button className="btn btn-sm btn-square btn-warning" onClick={() => viewLeadDetails(lead)}>
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                                <button className="btn btn-sm btn-square btn-error" onClick={() => handleDelete(lead.id)}>
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
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
            {isDetailModalOpen && <LeadDetailsModal lead={selectedLead} closeModal={() => setIsDetailModalOpen(false)} />}
            <dialog id="my_modal_5" className="modal">
                <form method="dialog" className="modal-box">
                    <h3 className="font-bold text-lg">Upload Excel Siswa</h3>
                    <p className="py-4">
                        Silahkan upload file Excel siswa pada field di bawah ini.
                    </p>
                    <button className="btn bg-red-500 text-white w-[150px] text-xs mb-3" type="button" onClick={downloadTemplate}>Download Template</button>
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
