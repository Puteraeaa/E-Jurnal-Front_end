  import React, { useEffect, useState } from "react";
  import { useParams, Link } from "react-router-dom";
  import Api from "../../api";
  import Cookies from "js-cookie";
  import "react-quill/dist/quill.snow.css";
  import hasAnyPermission from "../../utils/Permissions";
  import moment from "moment";
  import axios from "axios";
  import CryptoJS from "crypto-js";


  const LessonDetailPage = () => {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const token = Cookies.get("token");

    const fetchData = async () => {
      await Api.get(`admin/jurnal/${decryptedId}`, {
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

    const decryptId = (encryptedId) => {
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const decoded = decodeURIComponent(encryptedId); 
        const bytes = CryptoJS.AES.decrypt(decoded, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    };
    
    const decryptedId = decryptId(id);


      const encryptId = () => {
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const encrypted = CryptoJS.AES.encrypt(decryptedId.toString(), secretKey).toString();
    
        return encodeURIComponent(encrypted); // Encode hasil enkripsi agar valid di URL
      };


      

    return (
      <section className="py-4 px-4 sm:px-6 lg:px-8 ">
        {/* Modal for showing enlarged image */}
    

        {isModalOpen && (
          <div
            className="fixed inset-0 md:p-0 p-4 bg-black bg-opacity-75 flex-row flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target.classList.contains("fixed")) closeModal();
            }}
          >
            <div className="bg-white md:p-10 p-4 rounded-lg relative md:w-1/2 w-full">
              <img
                src={data.image}
                alt="Enlarged view"
                className="w-full h-auto"
              />
            </div>
            <button
                className="mt-4 text-xl text-gray-600 hover:text-gray-800 absolute md:bottom-[100px] bottom-[200px] bg-white dark:bg-gray-900 py-2 px-4 rounded-full"
                onClick={closeModal}
              >
                X
              </button>
          </div>
        )}

        <div className="container mx-auto mb-4 bg-white p-4 rounded dark:bg-gray-800" >
        <div className=" md:mt-[9px] md:mb-[-40px] flex">
              <button
                onClick={() => window.history.back()} // Kembali ke halaman sebelumnya
                className="bg-blue-600 text-white font-semibold py-1 md:py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ease-in-out flex items-center text-sm md:text-base "
              >
                <i className="fa-solid fa-backward fa-[10px] mr-1 "></i>
                
              </button>
            </div>
          <div className="text-center">
            <div className="text-black font-poppins">
              <h1 className="text-2xl md:text-3xl font-bold mt-1 dark:text-white">Jurnal PKL</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3  ">
            <div className="card border-0 shadow-lg bg-white rounded-lg dark:bg-gray-800">
              <div className="card-body p-4">
                <div className="flex items-center mb-4">
                  <img
                  src={
                    // Jika gambar dari users students ada, gunakan itu
                    data.users?.students?.image &&
                      data.users.students.image !==
                      "https://api.jurnal.pplgsmkn1ciomas.my.id/storage"
                      ? data.users.students.image
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                    alt={data.name}
                    className="w-16
                    h-16 rounded-full border-2 border-gray-300 cursor-pointer"
                    
                  />
                  <div className="ml-4">
                    <h2 className="text-md md:text-2xl font-semibold dark:text-white">
                      {data.users ? data.users.students?.name : ""}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base dark:text-gray-400">
                      {data.users?.students?.classes?.name ?? "-"} |{" "}
                      {data.users?.students?.industries?.name ?? "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="card border-0 shadow-lg bg-white rounded-lg dark:bg-gray-800">
              <div className="card-body p-4">
                <div className="mb-4">
                  <p className="text-gray-600 text-sm md:text-base dark:text-white">
                    Waktu lama PKL
                  </p>
                  <h2 className="text-xl md:text-2xl font-semibold dark:text-white">
                    {formattedStartTime} WIB s/d {formattedEndTime} WIB
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="card border-0 shadow-lg bg-white rounded-lg dark:bg-gray-800">
              <div className="card-body p-4 flex flex-col md:flex-row">
                <div className="mb-4">
                  <p className="text-gray-600 text-sm md:text-base dark:text-white">
                    Laporan di upload
                  </p>
                  <h2 className="text-xl md:text-2xl font-semibold  dark:text-white">
                    {data.created_at?.slice(0, 10) || "N/A"}
                  </h2>
                </div>
                <div className="mb-4 ml-0 md:ml-6">
                  <p className="text-gray-600 text-sm md:text-base dark:text-white">Tools</p>
                  <h2 className="text-xl md:text-2xl font-semibold dark:text-white">
                    {data.tools || "N/A"}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {hasAnyPermission(["murid.index"]) && (
            <div className="md:w-1/7">
              <div className="card border-0 shadow-lg bg-white rounded-lg dark:bg-gray-800">
                <div className="card-body p-4 flex flex-col md:flex-row">
                  <div className="mb-0 md:mb-4">
                    <Link to={`/app/edit-laporan/${encryptId()}`}>
                      <button className="btn btn-sm btn-primary w-full">Edit Laporan</button>
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
              <div className="card border-0 shadow-lg bg-white rounded-lg w-full md:w-1/3 w-1/2 mx-auto dark:bg-gray-800">
                <div className="card-body p-4">
                  <img
                    src={data.image}
                    alt=""
                    className="w-full h-auto object-cover rounded-lg mx-auto cursor-pointer"
                    onClick={handleImageClick} // Open modal on image click
                  />
                </div>
              </div>
            </div>
          )}

        <div className="container mx-auto mt-4">
          <div className="card border-0 shadow-lg bg-white rounded-lg dark:bg-gray-800">
            <div className="card-body p-4">
              <h1 className="text-2xl md:text-3xl font-semibold mb-4 dark:text-white" >
                Deskripsi Laporan
              </h1>
              <div
                className="sm:text-sm text-xs dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
              <p></p>
              <p className="text-gray-600 text-xs md:text-sm mt-2 dark:text-gray-400">
                Laporan di Upload {data?.created_at?.slice(0, 10) || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default LessonDetailPage;
