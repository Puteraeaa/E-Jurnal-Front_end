import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { getLeadsContent } from "../leadSlice";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import LeadDetailsModal from "./DetailModal";
import Api from "../../../api";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const [siswa,setSiswa] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 10,
        total: 0
    })
    const token = Cookies.get("token");



    const fetchData = async (pageNumber = 1, keywords = '') => {
        const page = pageNumber ? pageNumber : pagination.currentPage;

        await Api.get(`admin/student`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(response => {
            setSiswa(response.data.data.data);
            console.log(response.data.data.data);
            setPagination(() => ({
                currentPage: response.data.data.current_page,
                perPage: response.data.data.per_page,
                total: response.data.data.total
            }));
        });
    }

    useEffect(() => {
        fetchData();
    }, []);










    useEffect(() => {
        dispatch(getLeadsContent());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredLeads = leads.filter((lead) =>
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
                        <tbody className="text-center">
                        {loading ? (
                                [...Array(8)].map((_, index) => <SkeletonRow key={index} />) // Display skeleton rows
                            ) : (
                                siswa.map((lead) => (
                                    <tr key={lead.id}>
                                        <td>
                                            <div className="font-bold">{lead.name}</div>
                                        </td>
                                        <td>{lead.classes ? lead.classes.name : "-"}</td>
                                        <td><div className={getStatusClass(lead)}>{lead.industries ? "Sedang" : "Belum"}</div></td>
                                        <td>{lead.industries ? lead.industries.name : "-"}</td>
                                        <td className="flex space-x-0 w-32">
                                            <button className="btn btn-ghost" onClick={() => viewLeadDetails(lead)}>
                                                Selengkapnya
                                            </button>
                                            <Link to={`/app/data/siswa/edit/${lead.id}`}>
                                                <button className="btn btn-square btn-ghost">
                                                    <PencilIcon className="w-5" />
                                                </button>
                                            </Link>
                                            <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentLead(lead.id)}>
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
            {isDetailModalOpen && <LeadDetailsModal lead={selectedLead} onClose={() => setIsDetailModalOpen(false)} />}
        </>
    );
};

export default Leads;
