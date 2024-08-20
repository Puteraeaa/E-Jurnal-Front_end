import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { getLeadsContent } from "../leadSlice";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import LeadDetailsModal from "./DetailOrangTua";
import EditLeadModal from "./EditOrangTua";
import AddLeadModal from "./TambahOrangTua";

const Leads = () => {
    const { leads } = useSelector((state) => state.lead);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const itemsPerPage = 8;

    const staticLeads = [
        {
            name: "Budi Santoso",
            email: "budisantoso@gmail.com",
            namaAnak: "Andi Santoso"
        },
        {
            name: "Joko",
            email: "Joko.owi@gmail.com",
            namaAnak: "Rina Joko"
        },
    ];

    useEffect(() => {
        dispatch(getLeadsContent());
    }, [dispatch]);

    const openAddNewLeadModal = () => {
        setIsAddModalOpen(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const combinedLeads = [...leads, ...staticLeads];

    const filteredLeads = combinedLeads.filter((lead) =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.namaAnak.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteCurrentLead = (index) => {
        dispatch(openModal({
            title: "Confirmation",
            bodyType: "CONFIRMATION",
            extraObject: { message: `Are you sure you want to delete this lead?`, index }
        }));
    };

    const openEditLeadModal = (lead) => {
        setSelectedLead(lead);
        setIsEditModalOpen(true);
    };

    const viewLeadDetails = (lead) => {
        setSelectedLead(lead);
        setIsDetev
        ailModalOpen(true);
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

    return (
        <>
            <TitleCard title="Data Orang Tua" topMargin="mt-2" TopSideButtons={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <input
                        type="text"
                        className="input input-bordered input-sm mb-4 sm:mb-0 sm:mr-4 w-full sm:w-auto"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto" onClick={openAddNewLeadModal}>Add New</button>
                </div>
            }>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full text-center">
                        <thead>
                            <tr>
                                <th>Nama Orang Tua</th>
                                <th>Email</th>
                                <th className="w-1/4 text-center">Nama Anak</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {currentItems.map((lead, index) => (
                                <tr key={index}>
                                    <td className="whitespace-normal break-words">{lead.name}</td>
                                    <td className="whitespace-normal break-words">{lead.email}</td>
                                    <td className="whitespace-normal break-words max-w-xs">{lead.namaAnak}</td>
                                    <td className="flex justify-center space-x-2 sm:space-x-4">
                                        <button className="btn btn-ghost btn-xs" onClick={() => viewLeadDetails(lead)}>
                                            Selengkapnya
                                        </button>
                                        <button className="btn btn-square btn-ghost btn-xs" onClick={() => openEditLeadModal(lead)}>
                                            <PencilIcon className="w-5" />
                                        </button>
                                        <button className="btn btn-square btn-ghost btn-xs" onClick={() => deleteCurrentLead(index)}>
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
            {isDetailModalOpen && <LeadDetailsModal lead={selectedLead} onClose={() => setIsDetailModalOpen(false)} />}
            {isEditModalOpen && <EditLeadModal lead={selectedLead} onClose={() => setIsEditModalOpen(false)} />}
            {isAddModalOpen && <AddLeadModal onClose={() => setIsAddModalOpen(false)} />}
        </>
    );
};

export default Leads;
