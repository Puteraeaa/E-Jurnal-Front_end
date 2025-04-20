import React, { useEffect, useState } from 'react';
import Api from '../../api';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

const ArchiveTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // State untuk loading
    const { archiveId } = useParams();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Set loading ke true saat mulai fetch data
                const token = Cookies.get('token');
                const response = await Api.get(`/admin/students/archived/${archiveId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Set loading ke false setelah selesai fetch data
            }
        };

        fetchData();
    }, [archiveId]);

    return (
        <div className="p-8 bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-bold mb-6 text-blue-700 flex items-center gap-2">
                📦 Arsip Siswa Tahun <span className="badge badge-info text-white">{archiveId}</span>
            </h2>
            <div className="overflow-x-auto">
                {loading ? ( // Tampilkan loading jika state loading true
                    <div className="text-center py-4 text-gray-500">Loading...</div>
                ) : (
                    <table className="table table-zebra w-full text-sm">
                        <thead className="bg-gray-100 text-gray-800 uppercase">
                            <tr>
                                <th>No</th>
                                <th>Nama Siswa</th>
                                <th>Jurusan</th>
                                <th>Kelas</th>
                                <th>Industri</th>
                                <th>Guru</th>
                                <th>Tahun PKL</th>
                                <th>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50 transition">
                                        <td className="font-semibold">{index + 1}</td>
                                        <td>{item?.student?.name}</td>
                                        <td>{item?.student?.departements?.name}</td>
                                        <td>{item?.student?.classes?.name}</td>
                                        <td>{item?.student?.industries?.name}</td>
                                        <td>{item?.student?.teachers?.name}</td>
                                        <td>
                                            <span className="badge badge-secondary">
                                                {new Date(item?.student?.created_at).getFullYear()}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => window.location.href = item.archive_link}
                                                className="btn btn-sm btn-outline btn-primary"
                                            >
                                                📥 Download
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500">
                                        Tidak ada data arsip ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ArchiveTable;
