import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Api from '../../api'; // Adjust the import path as necessary
import Cookies from 'js-cookie';

const LeadEditPage = () => {
    const { id } = useParams(); // Get ID from URL parameters
    const navigate = useNavigate();
    const [lead, setLead] = useState({
        score: "",
        skills: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchLeadData = async () => {
            setLoading(true);
            try {
                const response = await Api.get(`admin/penilaian/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setLead(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching lead data:", error);
                setError("Failed to fetch lead data");
                setLoading(false);
            }
        };

        fetchLeadData();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLead(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Api.put(`admin/penilaian/${id}`, lead, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            navigate('/app/rekapnilai'); // Redirect after successful update
        } catch (error) {
            console.error("Error updating lead data:", error);
            setError("Failed to update lead data");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-6">
            <h3 className="font-bold text-3xl text-center mb-6">Edit Nilai</h3>

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
                            <tr>
                                <td className="border border-black px-4 py-2 text-center font-semibold">1</td>
                                <td className="border border-black px-4 py-2 font-semibold">Perilaku/Keselamatan Kerja</td>
                                <td className="border border-black px-4 py-2 text-center font-semibold">
                                    <input
                                        type="number"
                                        name="score"
                                        value={lead.score}
                                        onChange={handleChange}
                                        className="w-full text-center bg-gray-100"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mb-8">
                    <h4 className="font-bold text-2xl mb-4">B. Aspek Produktif</h4>
                    <table className="table-auto w-full border border-black">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-black py-2 font-bold w-10">No</th>
                                <th className="border border-black px-4 py-2 font-bold w-1/2">Kemampuan</th>
                                <th className="border border-black px-4 py-2 font-bold">Nilai</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black px-4 py-2 text-center font-semibold">1</td>
                                <td className="border border-black px-4 py-2 font-semibold">Pemrograman</td>
                                <td className="border border-black px-4 py-2 text-center font-semibold">
                                    <input
                                        type="text"
                                        name="skills"
                                        value={lead.skills}
                                        onChange={handleChange}
                                        className="w-full text-center bg-gray-100"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-6 space-x-4">
                    <button type="submit" className="btn btn-md border-blue-500 w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-700">Save</button>
                    <Link to="/app/rekapnilai">
                        <button type="button" className="btn btn-md border-black w-full sm:w-auto">Close</button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LeadEditPage;
