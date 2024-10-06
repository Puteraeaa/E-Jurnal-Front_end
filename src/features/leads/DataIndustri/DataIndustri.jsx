import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TitleCard from "../../../components/Cards/TitleCard";
import Api from "../../../api";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert2";
import template from '../../../assets/Template import-industri.xlsx';

const Leads = () => {
    const { leads, loading, error } = useSelector((state) => state.lead);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 10;
    const [siswa, setSiswa] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 10,
        total: 0
    });
    const token = Cookies.get("token");

    const fetchData = async (pageNumber = 1) => {
        try {
            const response = await Api.get(`admin/industri?page=${pageNumber}`, {
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

    const totalPages = Math.ceil(pagination.total / pagination.perPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const pages = [];
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

    const filteredLeads = siswa.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.industryMentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.alamat.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    
   

    
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
                fetchData(currentPage); // Re-fetch data after deletion
            }
        } catch (error) {
            console.error("Error deleting lead:", error);
            toast.error("Failed to delete lead.", {
                position: "top-right",
                duration: 4000,
            });
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to the first page when search term changes
    };

    // Filter the siswa array based on the search term
   

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

    const downloadTemplate = () => {
        const link = document.createElement('a');
        link.href = template;
        link.setAttribute('download', 'Template import-industri.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate the pagination slice for filteredLeads
   

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <TitleCard title="Data Industri" topMargin="mt-2" TopSideButtons={
                <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2">
                    <input
                        type="text"
                        className="input input-bordered input-sm w-full sm:w-64"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Link to={"/app/data/industri/tambah"}>
                        <button
                            className="btn btn-sm normal-case btn-primary w-full sm:w-auto"
                        >
                            Add New
                        </button>
                    </Link>
                    <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto" onClick={() => document.getElementById('my_modal_5').showModal()}>
                        Import Excel
                    </button>
                </div>
            }>
                <div className="overflow-x-auto w-full">
                    <table className="table w-[150%] md:w-full text-center">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Bidang</th>
                                <th>Alamat</th>
                                <th>Pembimbing</th>
                                <th className="text-center col-6">No Pembimbing</th>
                                <th className="text-center col-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id}>
                                    <td>
                                        <div className="font-bold">{lead.name}</div>
                                    </td>
                                    <td>{lead.bidang}</td>
                                    <td>{lead.alamat}</td>
                                    <td>{lead.industryMentorName}</td>
                                    <td>{lead.industryMentorNo}</td>
                                    <td className="flex justify-center space-x-2 sm:space-x-4">
                                        <Link to={`/app/data/industri/edit/${lead.user_id}`}>
                                            <button className="btn btn-sm btn-square btn-primary">
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                        </Link>
                                        <button className="btn btn-sm btn-square btn-error" onClick={() => handleDelete(lead.user_id)}>
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4 gap-2">
                    {renderPagination()}
                </div>
            </TitleCard>

            <ToastContainer />

            <dialog id="my_modal_5" className="modal">
                <form method="dialog" className="modal-box">
                    <h3 className="font-bold text-lg">Upload Excel Siswa</h3>
                    <p className="py-4">
                        Silahkan upload file Excel siswa pada field di bawah ini.
                    </p>
                    <button className="btn btn-sm" onClick={downloadTemplate}>Download Template</button>
                    <input type="file" onChange={handleFileChange} />
                    <button type="button" className="btn btn-sm btn-primary" onClick={handleFileUpload} disabled={isLoading}>
                        {isLoading ? "Uploading..." : "Upload"}
                    </button>
                </form>
            </dialog>
        </>
    );
};

export default Leads;
