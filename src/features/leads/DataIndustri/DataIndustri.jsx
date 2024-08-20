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
import Map from "../../../components/Map";

const Leads = () => {
    const { leads, loading, error } = useSelector((state) => state.lead);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
    const itemsPerPage = 8;
    const [siswa, setSiswa] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 10,
        total: 0
    });
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [bidang, setBidang] = useState("");
    const [alamat, setAlamat] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [industryMentorName, setIndustryMentorName] = useState("");
    const [industryMentorNo, setIndustryMentorNo] = useState("");
    const token = Cookies.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post(`admin/industri`, {
                user_id: userId,
                name,
                bidang,
                alamat,
                longitude,
                latitude,
                industryMentorName,
                industryMentorNo,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            toast.success(response.data.message, {
                position: "top-right",
                duration: 4000,
            });
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors;
                for (const field in errors) {
                    toast.error(`${field}: ${errors[field].join(', ')}`, {
                        position: "top-right",
                        duration: 4000,
                    });
                }
            } else {
                console.error("Error adding lead:", error);
                toast.error("Failed to add lead.", {
                    position: "top-right",
                    duration: 4000,
                });
            }
        }
    };

    const fetchData = async (pageNumber = 1) => {
        try {
            const response = await Api.get(`admin/industri`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setSiswa(response.data);
            setPagination({
                currentPage: response.data.current_page,
                perPage: response.data.per_page,
                total: response.data.total
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                const response = await Api.delete(`admin/industri/${leadId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                toast.success(response.data.message, {
                    position: "top-right",
                    duration: 4000,
                });
                fetchData();  // Re-fetch data after deletion
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
    };

    const filteredLeads = siswa.filter((lead) =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

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

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredLeads.slice(startIndex, endIndex);

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
                            {currentItems.map((lead) => (
                                <tr key={lead.id}>
                                    <td>
                                        <div className="font-bold">{lead.name}</div>
                                    </td>
                                    <td>{lead.bidang}</td>
                                    <td>{lead.alamat}</td>
                                    <td>{lead.industryMentorName}</td>
                                    <td>{lead.industryMentorNo}</td>
                                    <td className="">
                                        <Link to={`/app/data/industri/edit/${lead.id}`}>
                                            <button className="btn btn-square btn-ghost">
                                                <PencilIcon className="w-5" />
                                            </button>
                                        </Link>
                                        <button className="btn btn-square btn-ghost" onClick={() => handleDelete(lead.id)}>
                                            <TrashIcon className="w-5" />
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


        </>
    );
};

export default Leads;
