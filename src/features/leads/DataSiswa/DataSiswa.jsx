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
import CryptoJS from "crypto-js";
import Select from "react-select";



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
    const [academicPrograms, setAcademicPrograms] = useState([]);
    

    const dataClass = [
        { value: null, label: "Semua Kelas" }, // Option for null
        ...academicPrograms.map((siswa) => ({
            value: siswa.id,
            label: siswa.name,
        })),
    ];
    const [selectedClass, setSelectedClass] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const encryptId = (id) => {
            const secretKey = process.env.REACT_APP_SECRET_KEY;
            const encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
        
            return encodeURIComponent(encrypted); // Encode hasil enkripsi agar valid di URL
        };


        const fetchDataClass = async (keywords = "") => {
            let allData = [];
            let pageNumber = 1;
            let totalPages = 1; // Placeholder to start the loop
        
            while (pageNumber <= totalPages) {
              const response = await Api.get(`admin/classes?search=${keywords}`, {
                params: {
                  page: pageNumber,
                  per_page: 100, // or set this to the max allowed per request
                },
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
        
              setPagination(() => ({
                currentPage: response.data.data.current_page,
                perPage: response.data.data.per_page,
                total: response.data.data.total,
              }));
        
            
        
              const { data } = response.data.data;
              const { current_page, last_page } = response.data.data;
        
              // Concatenate new data to allData array
              allData = [...allData, ...data];
        
              // Update pagination details
              pageNumber = current_page + 1;
              totalPages = last_page;
            }

            setAcademicPrograms(allData);
           
        
          };
        
          useEffect(() => {
            fetchDataClass();
          }, []);


          const fetchData = async (pageNumber = 1, search = "", classId = null) => {
            setIsLoadingData(true); // Set loading to true when fetching data
            console.log(searchTerm);
            const page = pageNumber;
            const searchParam = searchTerm;
            const class_id = classId || selectedClass?.value; // Gunakan class_id dari parameter atau state
            let endpoint = "";
          
            if (role === "orang tua" || role === "guru" || role === "industri") {
              endpoint = `admin/Studentbyrole`;
            } else {
              endpoint = `admin/student`;
            }
          
            try {
           
              const response = await Api.get(`${endpoint}`, {
                params: {
                  page,
                  search: searchParam,
                  class_id,
                },
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
          
              setSiswa(response.data.data.data);
              setPagination({
                currentPage: response.data.data.current_page,
                perPage: response.data.data.per_page,
                total: response.data.data.total,
              });
            } catch (error) {
              console.error("Error fetching data:", error);
            } finally {
              setIsLoadingData(false); // Set loading to false after fetching data
            }
          };
    
          useEffect(() => {
            fetchData(currentPage, searchTerm, selectedClass?.value); // Tambahkan selectedClass sebagai parameter
          }, [currentPage, searchTerm, selectedClass]); // Tambahkan selectedClass sebagai dependensi
    
          const handleClassChange = (selectedOption) => {
            setSelectedClass(selectedOption); // Perbarui state selectedClass
            setCurrentPage(1); // Reset ke halaman pertama
            fetchData(1, searchTerm, selectedOption?.value); // Kirim class_id ke fetchData
          };

    useEffect(() => {
        fetchData(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    useEffect(() => {
        dispatch(getLeadsContent());
    }, [dispatch]);

   



   

    const getStatusClass = (lead) => {
        if (lead.industries) return "badge badge-secondary badge-xs p-3 bg-green-500 border-green-500 w-20"; // Status is "Sedang"
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

    // archive siswa
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showCheckbox, setShowCheckbox] = useState(false);
    
    const toggleCheckbox = () => {
      setShowCheckbox((prev) => !prev); // Toggle checkbox visibility
    };

    const handleCheckboxChange = (studentId) => {
      setSelectedStudents((prevSelected) => {
        if (prevSelected.includes(studentId)) {
          return prevSelected.filter((id) => id !== studentId);
        } else {
          return [...prevSelected, studentId];
        }
      });
    };
    

    const handleArchiveSelected = async () => {
      if (selectedStudents.length === 0) {
        toast.error("No students selected for archiving.", {
          position: "top-right",
          duration: 4000,
        });
        return;
      }

      try {
        const { isConfirmed } = await swal.fire({
          title: "Yakin?",
          text: "Apakah Anda yakin ingin mengarchive siswa yang dipilih?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Archive!",
        });

        if (isConfirmed) {
          const response = await Api.post(
            `admin/students/archive`,
            { student_ids: selectedStudents },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.success(response.data.message, {
            position: "top-right",
            duration: 4000,
          });
          setSelectedStudents([]); // Clear selected students
          fetchData(currentPage); // Re-fetch data after archiving
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error archiving students:", error);
        toast.error("Failed to archive students.", {
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
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        fetchData(1, e.target.value); // Fetch data based on updated search term
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                {/* Search Input */}
                <input
                  type="text"
                  className="input input-sm input-bordered w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                  placeholder="🔍 Cari siswa..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              
                {/* Conditional Buttons and Select */}
                {hasAnyPermission(["siswa.delete"]) && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center w-full sm:w-auto">
                    {/* Select Class */}
                    <Select
                      options={dataClass}
                      value={selectedClass}
                      onChange={handleClassChange}
                      placeholder="🎓 Pilih Kelas"
                      className="w-full sm:w-48 text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
              
                    {/* Add New Button */}
                    <Link to="/app/data/siswa/tambah" className="w-full sm:w-auto">
                      <button className="btn btn-sm normal-case btn-primary w-full sm:w-auto hover:scale-105 transition-all duration-150">
                        ➕ Tambah
                      </button>
                    </Link>
              
                    {/* Download All Data Button */}
                    <button
                      className="btn btn-sm normal-case btn-warning w-full sm:w-auto hover:scale-105 transition-all duration-150"
                      onClick={downloadData}
                    >
                      📥 Download Data
                    </button>
              
                    {/* Import Excel Button */}
                    <button
                      className="btn btn-sm normal-case btn-primary w-full sm:w-auto hover:scale-105 transition-all duration-150"
                      onClick={() => document.getElementById("my_modal_5").showModal()}
                    >
                      📂 Import Excel
                    </button>

                    <button
        className={`btn btn-sm normal-case ${showCheckbox ? "btn-secondary" : "btn-error"} w-full sm:w-auto hover:scale-105 transition-all duration-150`}
        onClick={toggleCheckbox}
      >
        {showCheckbox ? "Batal Pilih" : "Archive Siswa"}
      </button>

                    {showCheckbox && (
                      <button
                        className="btn btn-sm normal-case btn-secondary w-full sm:w-auto hover:scale-105 transition-all duration-150"
                        onClick={handleArchiveSelected}
                      >
                        📦 Archive
                      </button>
                    )}

                    
                  </div>
                )}
              </div>
        
            <TitleCard title={`Data Siswa (${pagination.total})`} topMargin="mt-2" >
                <div className="overflow-x-auto w-full">
                    <table className="table w-full text-center">
                        <thead>
                            <tr>
                              {showCheckbox && <th>Pilih</th>}
                                <th>Nama</th>
                                <th>Kelas</th>
                                <th>Status PKL</th>
                                <th>Tempat PKL</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-[#191e24]">
                            {isLoadingData ? (
                                <SkeletonRow />
                            ) : siswa.length > 0 ? (
                                siswa.map((lead) => (
                                    <tr key={lead.id}>
                                        {showCheckbox && (
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(lead.id)}
                                                    onChange={() => handleCheckboxChange(lead.id)}
                                                />
                                            </td>
                                        )}
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
                                            <Link to={`/app/data/siswa/edit/${encryptId(lead.user_id)}}`}>
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
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-gray-500">
                                        Tidak ada data.
                                    </td>
                                </tr>
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
