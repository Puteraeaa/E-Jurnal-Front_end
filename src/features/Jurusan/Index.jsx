import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Api from "../../api";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import hasAnyPermission from "../../utils/Permissions.jsx";
import Pagination from "../../components/Pagination";
import swal from "sweetalert2";
import axios from "axios";

export default function AcademicProgramList() {
  const [academicPrograms, setAcademicPrograms] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    perPage: 0,
    total: 0
  });
  const [keywords, setKeywords] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [newProgramName, setNewProgramName] = useState("");
  const token = Cookies.get("token");

  const fetchData = async (pageNumber = 1, keywords = "") => {
    const page = pageNumber ? pageNumber : pagination.currentPage;

    await Api.get(`admin/departemen`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      setAcademicPrograms(response.data.data.data);
      setPagination(() => ({
        currentPage: response.data.data.current_page,
        perPage: response.data.data.per_page,
        total: response.data.data.total
      }));
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (program, e) => {
    e.preventDefault();
    setSelectedProgram(program);
    document.getElementById("my_modal_3").showModal();
  };

  const handleDelete = async (program, e) => {
    e.preventDefault();
    try {
      const { isConfirmed } = await swal.fire({
        title: "Yakin?",
        text: `Apakah Anda yakin ingin menghapus ${program.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Hapus!"
      });

      if (isConfirmed) {
        const response = await Api.delete(`admin/dapartemen/${program.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success(response.data.message, {
          position: "top-right",
          duration: 4000
        });
        fetchData();
      }
    } catch (error) {}
  };

  const updateProgram = async (e) => {
    e.preventDefault();
    document.getElementById("my_modal_3").close();
    try {
      const result = await swal.fire({
        title: "Memperbarui Program",
        text: "Apakah Anda yakin ingin Memperbarui Program?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Perbarui!"
      });

      if (result.isConfirmed) {
        await Api.put(
          `admin/departemen/${selectedProgram.id}`,
          {
            name: selectedProgram.name
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success("Program updated successfully!", {
          position: "top-right",
          duration: 4000
        });
        document.getElementById("my_modal_3").close();
        fetchData();
      }
    } catch (error) {}
  };

  const addProgram = async (e) => {
    e.preventDefault();
    document.getElementById("my_modal_add").close();
    try {
      const result = await swal.fire({
        title: "Tambah Program",
        text: "Apakah Anda yakin ingin Menambahkan Program?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Tambah!"
      });

      if (result.isConfirmed) {
        await Api.post(
          "admin/departemen",
          {
            name: newProgramName
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success("Program added successfully!", {
          position: "top-right",
          duration: 4000
        });
        document.getElementById("my_modal_add").close();
        fetchData();
        setNewProgramName("");
      }
    } catch (error) {}
  };

  const searchData = async (e) => {
    setKeywords(e.target.value);
    fetchData(1, e.target.value);
  };

  return (
    <div className="container mx-auto my-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-[#1c2229] shadow-md rounded-lg p-6">
            <p className="border-b pb-2 font-bold text-xl">
              <i className="fas fa-graduation-cap"></i> DATA KEJURUAN
            </p>
            <p className="text-gray-600 font-semibold mt-2">
              Jumlah kejuruan yang terdftar di SMK Negeri 1 Ciomas sekarang
              adalah <span className="font-bold">{pagination.total}</span>{" "}
              kejuruan.
            </p>
          </div>
        </div>

        {/* Add Program Button */}
        <div>
          <button
            onClick={() => document.getElementById("my_modal_add").showModal()}
            className="bg-blue-600 dark:bg-gray-700 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md w-[240px] flex justify-center text-sm md:text-[17px] items-center mb-0 md:w-[400px] md:mb-4"
          >
            <i className="fa fa-plus-circle mr-2 "></i> Tambah Data Jurusan
          </button>
        </div>

        <div>{/* Search functionality can be implemented here */}</div>
      </div>

      <div className="mt-1">
        <div className="bg-white dark:bg-[#1c2229] shadow-md rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="table-auto w-[140%] md:w-full">
                <thead>
                  <tr className="bg-[#3b82f5] dark:bg-gray-700 text-black dark:text-white text-sm uppercase font-semibold rounded-lg">
                    <th className="p-2 text-center col-3 ">No.</th>
                    <th className="p-2 text-center spacing-1 col-6">
                      Program Name
                    </th>
                    <th className="p-2 text-center col-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {academicPrograms.length > 0 ? (
                    academicPrograms.map((program, index) => (
                      <tr className="text-gray-700 dark:text-white" key={index}>
                        <td className="p-2 text-center font-bold border-b text-xs md:text-sm">
                          {++index +
                            (pagination.currentPage - 1) * pagination.perPage}
                        </td>
                        <td className="p-2 text-center font-bold border-b text-xs md:text-sm">
                          {program.name}
                        </td>
                        <td className="p-2 text-center border-b text-xs md:text-sm ">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-lg text-xs mr-2 md:p-3"
                            onClick={(e) => handleEditClick(program, e)}
                          >
                            <i className="fa fa-pencil-alt"></i>
                          </button>
                          <button
                            onClick={(e) => handleDelete(program, e)}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-lg text-xs md:p-3"
                          >
                            <i className="fa fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-gray-700">
                      <td
                        className="p-2 text-center font-bold border-b text-xs md:text-sm"
                        colSpan="3"
                      >
                        No data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination could be added here */}
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="my_modal_3" style={{ zIndex: -1 }} className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("my_modal_3").close();
            }}
          >
            ✕
          </button>
          <form onSubmit={updateProgram}>
            <h3 className="font-bold text-lg text-center">Edit Program</h3>
            <div className="py-4">
              <input
                type="text"
                defaultValue={selectedProgram?.name}
                onChange={(e) =>
                  setSelectedProgram({
                    ...selectedProgram,
                    name: e.target.value
                  })
                }
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-400 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Program Name"
              />
            </div>
            <div className="modal-action">
              <button className="btn" type="submit">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={(e) => {
                  document.getElementById("my_modal_3").close();
                  e.preventDefault();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Add Program Modal */}
      <dialog id="my_modal_add" style={{ zIndex: -1 }} className="modal">
        <div className="modal-box">
          <form onSubmit={addProgram}>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("my_modal_add").close();
              }}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg text-center">Tambah Jurusan</h3>
            <div className="py-4">
              <input
                type="text"
                value={newProgramName}
                onChange={(e) => setNewProgramName(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-400 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                required
                placeholder="Masukan Nama Jurusan"
              />
            </div>
            <div className="modal-action">
              <button className="btn" type="submit">
                Tambah
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("my_modal_add").close();
                }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
