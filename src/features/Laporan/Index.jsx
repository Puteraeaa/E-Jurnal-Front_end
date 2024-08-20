import React from 'react'
import { Link } from 'react-router-dom'

function Index() {
  return (
    <div class="container mx-auto p-6">
    <div className="md:col-span-2">
                    <div className="bg-white dark:bg-[#1c2229] shadow-md rounded-lg p-6 mb-6">
                        <p className="border-b pb-2 font-bold text-xl md:text-4xl text-center ">
                            <i className="fas fa-chart-pie dark:text-white text-blue-600"></i> Data Laporan PKL
                        </p>
                        <p className="text-gray-600 font-semibold mt-2 dark:text-white text-center text-xs md:text-base ">
                            Ini adalah laporan PKL yang dibuat oleh Siswa SMKN 1 Ciomas dari semua <span className="font-bold"></span> kejuruan.
                        </p>
                    </div>
                </div>
                <input type="text" placeholder="Serch" className="input w-full max-w-xs input-bordered h-9 mx-auto md:ml-[1030px] mb-5 md:mt-0 mt-1 md:ml-3"  />
    <Link to="/app/laporan-pkl/tambah" class="inline-block bg-blue-500 text-white text-sm font-semibold md:py-1 md:px-2 md:text-base  py-1 px-2 rounded hover:bg-blue-600 transition-colors duration-300 mb-5  ml-4">Tambah Laporan</Link>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
       
   

    <div class="report-card bg-white p-6 h-[290px] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800">
        <a
                        
                        href={`/list-materi/`}
                        className="  rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-semibold mb-2  dark:text-white">Judul Laporan</h1>
                            <p className="text-gray-600 mb-4 dark:text-white">Tanggal: 20 Agustus 2024</p>
                            <p class="text-gray-700 mb-1 dark:text-white">Deskripsi singkat tentang kegiatan yang dilakukan selama PKL pada hari ini.</p>
                            <div className="divider "></div>
                            <div className="flex items-center mt-auto mb-auto">
                                <img
                                    src="https://picsum.photos/200/300" // Placeholder URL
                                    alt="Profile Mentor"
                                    className="w-10 h-10 rounded-full border object-cover"
                                />
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium">Putera Alfadri</h3>
                                    <p className="text-sm text-gray-500">XI PPLG 1 | PT Tujuh Cahaya</p>
                                </div>
                            </div>
                        </div>
                    </a>
        </div>

        <div class="report-card bg-white p-6 h-[290px] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800">
        <a
                        
                        href={`/app/detail-laporan/1`}
                        className="  rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-semibold mb-2  dark:text-white">Judul Laporan</h1>
                            <p className="text-gray-600 mb-4 dark:text-white">Tanggal: 20 Agustus 2024</p>
                            <p class="text-gray-700 mb-1 dark:text-white">Deskripsi singkat tentang kegiatan yang dilakukan selama PKL pada hari ini.</p>
                            <div className="divider "></div>
                            <div className="flex items-center mt-auto mb-auto">
                                <img
                                    src="https://picsum.photos/200/300" // Placeholder URL
                                    alt="Profile Mentor"
                                    className="w-10 h-10 rounded-full border object-cover"
                                />
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium">Putera Alfadri</h3>
                                    <p className="text-sm text-gray-500">XI PPLG 1 | PT Tujuh Cahaya</p>
                                </div>
                            </div>
                        </div>
                    </a>
        </div>

        <div class="report-card bg-white p-6 h-[290px] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800">
        <a
                        
                        href={`/app/detail-laporan/2`}
                        className="  rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-semibold mb-2  dark:text-white">Judul Laporan</h1>
                            <p className="text-gray-600 mb-4 dark:text-white">Tanggal: 20 Agustus 2024</p>
                            <p class="text-gray-700 mb-1 dark:text-white">Deskripsi singkat tentang kegiatan yang dilakukan selama PKL pada hari ini.</p>
                            <div className="divider "></div>
                            <div className="flex items-center mt-auto mb-auto">
                                <img
                                    src="https://picsum.photos/200/300" // Placeholder URL
                                    alt="Profile Mentor"
                                    className="w-10 h-10 rounded-full border object-cover"
                                />
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium">Putera Alfadri</h3>
                                    <p className="text-sm text-gray-500">XI PPLG 1 | PT Tujuh Cahaya</p>
                                </div>
                            </div>
                        </div>
                    </a>
        </div>


        <div class="report-card bg-white p-6 h-[290px] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800">
        <a
                        
                        href={`/app/detail-laporan/1`}
                        className="  rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-semibold mb-2  dark:text-white">Judul Laporan</h1>
                            <p className="text-gray-600 mb-4 dark:text-white">Tanggal: 20 Agustus 2024</p>
                            <p class="text-gray-700 mb-1 dark:text-white">Deskripsi singkat tentang kegiatan yang dilakukan selama PKL pada hari ini.</p>
                            <div className="divider "></div>
                            <div className="flex items-center mt-auto mb-auto">
                                <img
                                    src="https://picsum.photos/200/300" // Placeholder URL
                                    alt="Profile Mentor"
                                    className="w-10 h-10 rounded-full border object-cover"
                                />
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium">Putera Alfadri</h3>
                                    <p className="text-sm text-gray-500">XI PPLG 1 | PT Tujuh Cahaya</p>
                                </div>
                            </div>
                        </div>
                    </a>
        </div>


        <div class="report-card bg-white p-6 h-[290px] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800">
        <a
                        
                        href={`/app/detail-laporan/1`}
                        className="  rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-semibold mb-2  dark:text-white">Judul Laporan</h1>
                            <p className="text-gray-600 mb-4 dark:text-white">Tanggal: 20 Agustus 2024</p>
                            <p class="text-gray-700 mb-1 dark:text-white">Deskripsi singkat tentang kegiatan yang dilakukan selama PKL pada hari ini.</p>
                            <div className="divider "></div>
                            <div className="flex items-center mt-auto mb-auto">
                                <img
                                    src="https://picsum.photos/200/300" // Placeholder URL
                                    alt="Profile Mentor"
                                    className="w-10 h-10 rounded-full border object-cover"
                                />
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium">Putera Alfadri</h3>
                                    <p className="text-sm text-gray-500">XI PPLG 1 | PT Tujuh Cahaya</p>
                                </div>
                            </div>
                        </div>
                    </a>
        </div>
    
      
       

    </div>
</div>

  )
}

export default Index