import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { getLeadsContent } from "../leadSlice";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import LeadDetailsModal from "./DetailOrangTua";
import Api from "../../../api";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert2";

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
  };

const Leads = () => {
    const { leads, loading, error } = useSelector((state) => state.lead);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const itemsPerPage = 8;
    const [orangtua,setOrangTua] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 10,
        total: 0
    })
    const token = Cookies.get("token");



     const fetchData = async (pageNumber = 1) => {
        try {
            const response = await Api.get(`admin/parent?page=${pageNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        
            setOrangTua(response.data.data.data);
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

    const filteredLeads = orangtua.filter(lead =>
        lead.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.nama.toLowerCase().includes(searchTerm.toLowerCase())
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
                await Api.delete(`admin/users/${leadId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                toast.success("Data berhasil dihapus.", {
                    position: "top-right",
                    autoClose: 4000,
                });
                fetchData();  // Re-fetch data after deletion
            }
        } catch (error) {
            console.error("Error deleting lead:", error.response);
            toast.error("Gagal menghapus data.", {
                position: "top-right",
                autoClose: 4000,
            });
        }
    };
    

  

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <TitleCard title="Data Orang Tua" topMargin="mt-2" TopSideButtons={
                <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2">
                    <input
                        type="text"
                        className="input input-bordered input-sm w-full sm:w-64"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {/* <Link to="/app/data/orangtua/tambah">
                        <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto">Add New</button>
                    </Link> */}
                </div>
            }>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full text-center">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Nama Anak</th>
                                <th>Alamat</th>
                                <th>Nomor Telepon</th>
                                
                            </tr>
                        </thead>
                        <tbody className="text-center">
                        {loading ? (
                                [...Array(8)].map((_, index) => <SkeletonRow key={index} />) // Display skeleton rows
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id}>
                                        <td>
                                            <div className="font-bold">{lead.nama}</div>
                                        </td>
                                        <td>
                                            <div className="font-bold">{lead.users? lead.users.name : ""}</div>
                                        </td>
                                        <td>
                                            <div className="font-bold">{lead.alamat}</div>
                                        </td>
                                        <td>
                                            <div className="font-bold">{lead.phoneNumber}</div>
                                        </td>
                                       
                                        <td className="flex space-x-0 w-32">
                                            <button className="btn btn-ghost" onClick={() => viewLeadDetails(lead)}>
                                                Selengkapnya
                                            </button>
                                            <Link to={`/app/data/orangtua/edit/${lead.user_id}`}>
                                                <button className="btn btn-square btn-ghost">
                                                    <PencilIcon className="w-5" />
                                                </button>
                                            </Link>
                                            <button className="btn btn-square btn-ghost" onClick={() => handleDelete(lead.user_id)}>
    <TrashIcon className="w-5" />
</button>

                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4 gap-2">
                    {renderPagination()}
                </div>
            </TitleCard>
            <ToastContainer />
            {isDetailModalOpen && <LeadDetailsModal lead={selectedLead} onClose={() => setIsDetailModalOpen(false)} />}
        </>
    );
};

export default Leads;
