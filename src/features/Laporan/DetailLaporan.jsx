import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Api from "../../api";
import Cookies from "js-cookie";
import 'react-quill/dist/quill.snow.css';

const LessonDetailPage = () => {
  const { id } = useParams(); // Getting the lesson ID from URL parameters
  const [data, setData] = useState({});
  const token = Cookies.get("token");

  const studentProfile = {
    nama: "John Doe",
    kelas: "XI PPLG 1",
    sekolah: "PT Tujuh Cahaya",
    foto: "https://picsum.photos/200/300" // URL to the student's profile picture
  };

  const fetchData = async () => {
    await Api.get(`admin/jurnal/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setData(response.data.data);
      console.log('data', response.data.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 ">
      <div className="container mx-auto mb-4 bg-white p-4 rounded">
        <div className="text-center">
          <div className="text-black font-poppins">
            <p className="text-lg md:text-xl">Laporan PKL</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">{data.judul}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2">
          <div className="card border-0 shadow-lg bg-white rounded-lg">
            <div className="card-body p-4">
              <div className="flex items-center mb-4">
                <img
                  src={studentProfile.foto}
                  alt={data.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-300"
                />
                <div className="ml-4">
                  <h2 className="text-xl md:text-2xl font-semibold">{data.users ? data.users.name : '' }</h2>
                  <p className="text-gray-600 text-sm md:text-base">
                  {studentProfile.nama} | {studentProfile.sekolah}
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
                <p className="text-gray-600 text-sm md:text-base">Waktu lama PKL</p>
                <h2 className="text-xl md:text-2xl font-semibold">
                  {data.start_time} > {data.end_time}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/3 hidden md:block ">
          <div className="card border-0 shadow-lg bg-white rounded-lg">
            <div className="card-body p-4 flex flex-col md:flex-row">
              <div className="mb-4">
                <p className="text-gray-600 text-sm md:text-base">Laporan di upload</p>
                <h2 className="text-xl md:text-2xl font-semibold">
                  {data.created_at?.slice(0, 10) || 'N/A'}
                </h2>
              </div>
              <div className="mb-4 ml-[80px]">
                <p className="text-gray-600 text-sm md:text-base">Action</p>
                {/* <h2 className="text-xl md:text-2xl font-semibold">
                  {data.created_at?.slice(0, 10) || 'N/A'}
                </h2> */}
                <Link to={`/app/edit-laporan/${data.id}`}>
                <button className="btn btn-sm btn-primary w-36 "  >
                    Edit
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-4">
        <div className="card border-0 shadow-lg bg-white rounded-lg">
          <div className="card-body p-4">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4">Deskripsi Laporan</h1>
            <div className="formatted-content" dangerouslySetInnerHTML={{ __html: data.description }} />
            <p className="text-gray-600 text-xs md:text-sm mt-2">
              Laporan di Upload {data?.created_at?.slice(0, 10) || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonDetailPage;
