import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import TitleCard from "../../components/Cards/TitleCard";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import hasAnyPermission from "../../utils/Permissions";
import Api from "../../api";
import Cookies from "js-cookie";

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const itemsPerPage = 8;
  const token = Cookies.get("token");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 8,
    total: 0
  });

  useEffect(() => {
    const fetchLeads = async (pageNumber = 1) => {
      try {
        setStatus('loading');
        const response = await Api.get(`/admin/penilaian?page=${pageNumber}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setLeads(response.data.data.data);
        setPagination({
          currentPage: response.data.data.current_page,
          perPage: response.data.data.per_page,
          total: response.data.data.total
        });
        setStatus('succeeded');
      } catch (error) {
        setStatus('failed');
        console.error("Failed to fetch leads:", error);
      }
    };

    fetchLeads(currentPage);
  }, [currentPage, token]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const deleteCurrentLead = async (id) => {
    try {
      await Api.delete(`/admin/penilaian/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(leads.filter(lead => lead.id !== id));
      console.log("Deleted lead with ID:", id);
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  const totalPages = Math.ceil(pagination.total / itemsPerPage);

  const filteredLeads = leads.filter((lead) =>
    lead.score.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <TitleCard title="Rekap Nilai" topMargin="mt-2" TopSideButtons={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            className="input input-bordered input-sm mb-4 sm:mb-0 sm:mr-4 w-full sm:w-auto"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Link to="/app/data/guru/tambah">
            <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto">Add New</button>
          </Link>
        </div>
      }>
        <div className="overflow-x-auto w-full">
          <table className="table w-full text-center">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Nilai Kepribadian</th>
                <th className="w-1/4 text-center">Nilai Produktif</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-center">
              {status === 'loading' ? (
                <tr><td colSpan="4">Loading...</td></tr>
              ) : status === 'failed' ? (
                <tr><td colSpan="4">Error loading data</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((lead) => (
                  <tr key={lead.id} className="justify-center">
                    <td className="whitespace-normal break-words">{lead.students ? lead.students.name : ''}</td>
                    <td className="whitespace-normal break-words">{lead.score}</td>
                    <td className="whitespace-normal break-words max-w-xs">{lead.skills}</td>
                    <td className="flex justify-center space-x-2 sm:space-x-4">
                      <Link to={`/app/rekapnilai/detailnilai/${lead.id}`}>
                        <button className="btn btn-ghost btn-xs">
                          Selengkapnya
                        </button>
                      </Link>
                      {hasAnyPermission(["users.index"]) && (
                        <div className="flex">
                          <Link to={`/app/rekapnilai/editnilai/${lead.id}`}>
                            <button className="btn btn-square btn-ghost btn-xs">
                              <PencilIcon className="w-5" />
                            </button>
                          </Link>
                          <button className="btn btn-square btn-ghost btn-xs" onClick={() => deleteCurrentLead(lead.id)}>
                            <TrashIcon className="w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4">No data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4 gap-2">
          {totalPages > 1 && renderPagination()}
        </div>
      </TitleCard>
    </>
  );
};

export default Leads;
