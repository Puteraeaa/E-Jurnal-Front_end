import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import LeadDetailsModal from "./DetailGuru";
import Api from "../../../api";
import Cookies from "js-cookie";

const Leads = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [guru, setGuru] = useState([]);
    const itemsPerPage = 8;
    const token = Cookies.get("token");

    useEffect(() => {
        Api.get("admin/teacher", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const data = response.data.data.data || []; // Ensure the data is an array
            setGuru(Array.isArray(data) ? data : []);
            console.log("Fetched data:", response.data.data); // Check the structure of fetched data
        })
        .catch(error => console.error("Error fetching data:", error));
    }, [token]);

    const filteredLeads = guru.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.no_hp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.departements && lead.departements.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const currentItems = filteredLeads.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    return (
        <>
            <TitleCard 
                title="Data Guru" 
                topMargin="mt-2" 
                TopSideButtons={
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <input
                            type="text"
                            className="input input-bordered input-sm mb-4 sm:mb-0 sm:mr-4 w-full sm:w-auto"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Link to="/app/data/guru/tambah">
                            <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto">
                                Add New
                            </button>
                        </Link>
                    </div>
                }
            >
                <div className="overflow-x-auto w-full">
                    <table className="table w-full text-center">
                        <thead>
                            <tr>
                                <th>Nama Guru</th>
                                <th>Nomer Guru</th>
                                <th className="w-1/4 text-center">Pelajaran</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {currentItems.map((lead) => (
                                <tr key={lead.id}>
                                    <td className="whitespace-normal break-words">{lead.name}</td>
                                    <td className="whitespace-normal break-words">{lead.no_hp}</td>
                                    <td className="whitespace-normal break-words max-w-xs">
                                        {lead.departements ? lead.departements.name : ""}
                                    </td>
                                    <td className="flex justify-center space-x-2 sm:space-x-4">
                                        <button className="btn btn-ghost btn-xs" onClick={() => { setSelectedLead(lead); setIsDetailModalOpen(true); }}>
                                            Selengkapnya
                                        </button>
                                        <Link to={`/app/data/guru/edit/${lead.id}`}>
                                            <button className="btn btn-square btn-ghost btn-xs">
                                                <PencilIcon className="w-5" />
                                            </button>
                                        </Link>
                                        <button className="btn btn-square btn-ghost btn-xs" onClick={() => dispatch(openModal({
                                            title: "Confirmation",
                                            bodyType: "CONFIRMATION",
                                            extraObject: { message: `Are you sure you want to delete this lead?`, id: lead.id }
                                        }))}>
                                            <TrashIcon className="w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: Math.ceil(filteredLeads.length / itemsPerPage) }).map((_, i) => (
                        <button
                            key={i}
                            className={`btn btn-sm ${i + 1 === currentPage ? "btn-active" : ""}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </TitleCard>
            {isDetailModalOpen && <LeadDetailsModal lead={selectedLead} onClose={() => setIsDetailModalOpen(false)} />}
        </>
    );
};

export default Leads;
