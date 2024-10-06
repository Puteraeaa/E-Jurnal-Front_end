import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Api from "../../api";
import Cookies from "js-cookie";
import "react-quill/dist/quill.snow.css";
import hasAnyPermission from "../../utils/Permissions";
import moment from "moment";

const LessonDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const token = Cookies.get("token");

  const fetchData = async () => {
    await Api.get(`admin/jurnal/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setData(response.data.data || {});
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formattedStartTime = moment(data.start_time, "HH:mm:ss").format("HH:mm");
  const formattedEndTime = moment(data.end_time, "HH:mm:ss").format("HH:mm");

  // Function to handle opening the modal
  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 ">
      {/* Modal for showing enlarged image */}
      {isModalOpen && (
        <div
          className="fixed inset-0  bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal} // Close modal when background is clicked
        >
          <div className="bg-white p-10 rounded-lg relative w-1/2" >
            <button
              className="absolute text-3xl top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              ×
            </button>
            <img
              src={data.image}
              alt="Enlarged view"
              className="w-full h-auto "
            />
          </div>
        </div>
      )}

      <div className="container mx-auto mb-4 bg-white p-4 rounded">
        <div className="text-center">
          <div className="text-black font-poppins">
            <h1 className="text-2xl md:text-3xl font-bold mt-1">Jurnal PKL</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <div className="card border-0 shadow-lg bg-white rounded-lg">
            <div className="card-body p-4">
              <div className="flex items-center mb-4">
                <img
                  src={
                    data.users?.students?.image &&
                    data.users.students?.image !==
                      "https://api.jurnal.pplgsmkn1ciomas.my.id/storage"
                      ? data.users.students.image
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt={data.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-300 cursor-pointer"
                   // Open modal on image click
                />
                <div className="ml-4">
                  <h2 className="text-xl md:text-2xl font-semibold">
                    {data.users ? data.users.students?.name : ""}
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    {data.users?.students?.classes?.name ?? "-"} |{" "}
                    {data.users?.students?.industries?.name ?? "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="card border-0 shadow-lg bg-white rounded-lg">
            <div className="card-body p-4">
              <div className="mb-4">
                <p className="text-gray-600 text-sm md:text-base">
                  Waktu lama PKL
                </p>
                <h2 className="text-xl md:text-2xl font-semibold">
                  {formattedStartTime} WIB s/d {formattedEndTime} WIB
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="card border-0 shadow-lg bg-white rounded-lg">
            <div className="card-body p-4 flex flex-col md:flex-row">
              <div className="mb-4">
                <p className="text-gray-600 text-sm md:text-base">
                  Laporan di upload
                </p>
                <h2 className="text-xl md:text-2xl font-semibold">
                  {data.created_at?.slice(0, 10) || "N/A"}
                </h2>
              </div>
              <div className="mb-4 ml-0 md:ml-6">
                <p className="text-gray-600 text-sm md:text-base">Tools</p>
                <h2 className="text-xl md:text-2xl font-semibold">
                  {data.tools || "N/A"}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {hasAnyPermission(["murid.index"]) && (
          <div className="md:w-1/7">
            <div className="card border-0 shadow-lg bg-white rounded-lg">
              <div className="card-body p-4 flex flex-col md:flex-row">
                <div className="mb-0 md:mb-4">
                  <p className="text-gray-600 text-sm md:text-base">Action</p>
                  <Link to={`/app/edit-laporan/${data.id}`}>
                    <button className="btn btn-sm btn-primary w-36">Edit</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {data.image &&
        data.image !== "https://api.jurnal.pplgsmkn1ciomas.my.id/storage" && (
          <div className="container mx-auto mt-4">
            <div className="card border-0 shadow-lg bg-white rounded-lg w-full md:w-1/3 mx-auto">
              <div className="card-body p-4">
                <img
                  src={data.image}
                  alt=""
                  className="w-[50%] h-auto object-cover rounded-lg mx-auto cursor-pointer"
                  onClick={handleImageClick} // Open modal on image click
                />
              </div>
            </div>
          </div>
        )}

      <div className="container mx-auto mt-4">
        <div className="card border-0 shadow-lg bg-white rounded-lg">
          <div className="card-body p-4">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              Deskripsi Laporan
            </h1>
            <div
              className=" text-200 "
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
            <p></p>
            <p className="text-gray-600 text-xs md:text-sm mt-2">
              Laporan di Upload {data?.created_at?.slice(0, 10) || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonDetailPage;
