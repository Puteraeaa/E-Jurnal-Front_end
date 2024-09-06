import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LeadDetailsPage = () => {
    const { id } = useParams(); // Get ID from URL parameters
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [formData, setFormData] = useState({
        nilai1: "",
        nilai2: "",
        nilai3: "",
        nilai4: "",
        nilai5: "",
        nilai6: "",
        nilai7: "",
        nilai8: "",
        nilai9: "",
        nilai10: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch lead details from API
    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await axios.get(`/api/leads/${id}`);
                setLead(response.data);
                setFormData({
                    nilai1: response.data.nilai1 || "",
                    nilai2: response.data.nilai2 || "",
                    nilai3: response.data.nilai3 || "",
                    nilai4: response.data.nilai4 || "",
                    nilai5: response.data.nilai5 || "",
                    nilai6: response.data.nilai6 || "",
                    nilai7: response.data.nilai7 || "",
                    nilai8: response.data.nilai8 || "",
                    nilai9: response.data.nilai9 || "",
                    nilai10: response.data.nilai10 || "",
                });
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch lead details.");
                setLoading(false);
            }
        };

        fetchLead();
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission to update lead details
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/leads/${id}`, formData);
            navigate('/app/rekapnilai'); // Redirect after successful update
        } catch (err) {
            setError("Failed to update lead details.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!lead) return <div>Lead tidak ditemukan</div>;

    return (
        <div className="container mx-auto p-6">
            <h3 className="font-bold text-3xl text-center mb-6">Edit Nilai</h3>

            <div className="mb-8 ">
                <h4 className="font-bold text-2xl mb-4">Profil Siswa</h4>
                <div className="bg-white p-4 border border-gray-300 rounded">
                    <p className="font-bold">Nama: {lead.userProfile.name}</p>
                    <p>Kelas:  {lead.userProfile.kelas}</p>
                    <p>Guru pembimbing:  {lead.userProfile.pembimbing}</p>
                    <p>Tempat PKL:  {lead.userProfile.tempatPkl}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-8">
                    <h4 className="font-bold text-2xl mb-4">A. Aspek Kepribadian</h4>
                    <table className="table-auto w-full mb-6 border border-black">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-black py-2 font-bold w-10">No</th>
                                <th className="border border-black px-4 py-2 font-bold w-1/2">Kemampuan</th>
                                <th className="border border-black px-4 py-2 font-bold">Nilai</th>
                            </tr>
                        </thead>
                        <tbody>
                            {['nilai1', 'nilai2', 'nilai3', 'nilai4', 'nilai5'].map((nilai, index) => (
                                <tr key={index}>
                                    <td className="border border-black px-4 py-2 text-center font-semibold">{index + 1}</td>
                                    <td className="border border-black px-4 py-2 font-semibold">
                                        {['Disiplin Waktu', 'Kemampuan Kerja/Motivasi', 'Kualitas Kerja', 'Inisiatif dan Kreatif', 'Perilaku/Keselamatan Kerja'][index]}
                                    </td>
                                    <td className="border border-black px-4 py-2 text-center font-semibold">
                                        <input
                                            type="number"
                                            name={nilai}
                                            value={formData[nilai]}
                                            onChange={handleChange}
                                            className="w-full text-center bg-gray-100"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mb-8">
                    <h4 className="font-bold text-2xl mb-4">B. Aspek Produktif</h4>
                    <table className="table-auto w-full border border-black">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-black py-2 font-bold w-10 ">No</th>
                                <th className="border border-black px-4 py-2 font-bold w-1/2">Kemampuan</th>
                                <th className="border border-black px-4 py-2 font-bold">Nilai</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, index) => (
                                <tr key={index}>
                                    <td className="border border-black px-4 py-2 text-center font-semibold">{index + 1}</td>
                                    <td className="border border-black px-4 py-2 font-semibold">
                                        <input
                                            type="text"
                                            name={`kemampuan${index + 1}`}
                                            value={formData[`kemampuan${index + 1}`] || ""}
                                            onChange={handleChange}
                                            className="w-full bg-gray-100"
                                            placeholder={`Masukkan Kemampuan ${index + 1}`}
                                        />
                                    </td>
                                    <td className="border border-black px-4 py-2 text-center font-semibold">
                                        <input
                                            type="number"
                                            name={`nilai${index + 6}`}
                                            value={formData[`nilai${index + 6}`] || ""}
                                            onChange={handleChange}
                                            className="w-full text-center bg-gray-100"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-6 space-x-4">
                    <button type="submit" className="btn btn-md border-blue-500 w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-700">Save</button>
                    <Link to="/app/rekapnilai">
                        <button className="btn btn-md border-black w-full sm:w-auto">Close</button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LeadDetailsPage;
