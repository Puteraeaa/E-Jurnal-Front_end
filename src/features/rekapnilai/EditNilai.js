import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const LeadDetailsPage = () => {
    const { id } = useParams(); // Mengambil ID dari parameter URL

    const staticLeads = [
        {
            id: "01",
            nilai1: "86",
            nilai2: "86",
            nilai3: "84",
            nilai4: "87",
            nilai5: "98",
            nilai6: "90",
            nilai7: "90",
            nilai8: "",
            nilai9: "",
            nilai10: "",
            userProfile: {
                name: "John Doe",
                kelas: "XI PPLG 1",
                pembimbing: "Wanda",
                tempatPkl: "PT Transformasi Digital",
            }
        },
        {
            id: "02",
            nilai1: "80",
            nilai2: "90",
            nilai3: "87",
            nilai4: "89",
            nilai5: "87",
            nilai6: "88",
            nilai7: "90",
            nilai8: "",
            nilai9: "",
            nilai10: "",
        },
    ];

    // Menemukan lead yang sesuai berdasarkan ID
    const currentLead = staticLeads.find(lead => lead.id === id);

    // State untuk menyimpan nilai input yang dapat diedit
    const [formData, setFormData] = useState({
        nilai1: currentLead?.nilai1 || "",
        nilai2: currentLead?.nilai2 || "",
        nilai3: currentLead?.nilai3 || "",
        nilai4: currentLead?.nilai4 || "",
        nilai5: currentLead?.nilai5 || "",
        nilai6: currentLead?.nilai6 || "",
        nilai7: currentLead?.nilai7 || "",
        nilai8: currentLead?.nilai8 || "",
        nilai9: currentLead?.nilai9 || "",
        nilai10: currentLead?.nilai10 || "",
        kemampuan1: "Pemrograman", // Misalnya, kemampuan default pada Aspek Produktif
        kemampuan2: "Desain Grafis", // Misalnya, kemampuan default pada Aspek Produktif
    });

    if (!currentLead) {
        return <div>Lead tidak ditemukan</div>;
    }

    // Menghandle perubahan nilai input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="container mx-auto p-6">
            <h3 className="font-bold text-3xl text-center mb-6">Edit Nilai</h3>

            <div className="mb-8 ">
                <h4 className="font-bold text-2xl mb-4">Profil Siswa</h4>
                <div className="bg-white p-4 border border-gray-300 rounded">
                    <p className="font-bold">Nama: {currentLead.userProfile.name}</p>
                    <p>Kelas:  {currentLead.userProfile.kelas}</p>
                    <p>Guru pembimbing:  {currentLead.userProfile.pembimbing}</p>
                    <p>Tempat PKL:  {currentLead.userProfile.tempatPkl}</p>
                </div>
            </div>

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
                            <td className="border border-black px-4 py-2 font-semibold">Disiplin Waktu</td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">
                                <input
                                    type="number"
                                    name="nilai1"
                                    value={formData.nilai1}
                                    onChange={handleChange}
                                    className="w-full text-center bg-gray-100"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">2</td>
                            <td className="border border-black px-4 py-2 font-semibold">Kemampuan Kerja/Motivasi</td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">
                                <input
                                    type="number"
                                    name="nilai2"
                                    value={formData.nilai2}
                                    onChange={handleChange}
                                    className="w-full text-center bg-gray-100"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">3</td>
                            <td className="border border-black px-4 py-2 font-semibold">Kualitas Kerja</td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">
                                <input
                                    type="number"
                                    name="nilai3"
                                    value={formData.nilai3}
                                    onChange={handleChange}
                                    className="w-full text-center bg-gray-100"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">4</td>
                            <td className="border border-black px-4 py-2 font-semibold">Inisiatif dan Kreatif</td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">
                                <input
                                    type="number"
                                    name="nilai4"
                                    value={formData.nilai4}
                                    onChange={handleChange}
                                    className="w-full text-center bg-gray-100"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">5</td>
                            <td className="border border-black px-4 py-2 font-semibold">Perilaku/Keselamatan Kerja</td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">
                                <input
                                    type="number"
                                    name="nilai5"
                                    value={formData.nilai5}
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
                            <th className="border border-black py-2 font-bold w-10 ">No</th>
                            <th className="border border-black px-4 py-2 font-bold w-1/2">Kemampuan</th>
                            <th className="border border-black px-4 py-2 font-bold">Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">1</td>
                            <td className="border border-black px-4 py-2 font-semibold">
                                <input
                                    type="text"
                                    name="kemampuan1"
                                    value={formData.kemampuan1}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100"
                                />
                            </td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">
                                <input
                                    type="number"
                                    name="nilai6"
                                    value={formData.nilai6}
                                    onChange={handleChange}
                                    className="w-full text-center bg-gray-100"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">2</td>
                            <td className="border border-black px-4 py-2 font-semibold">
                                <input
                                    type="text"
                                    name="kemampuan2"
                                    value={formData.kemampuan2}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100"
                                />
                            </td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">
                                <input
                                    type="number"
                                    name="nilai7"
                                    value={formData.nilai7}
                                    onChange={handleChange}
                                    className="w-full text-center bg-gray-100"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">3</td>
                            <td className="border border-black px-4 py-2 font-semibold">
                                <input
                                    type="text"
                                    name="kemampuan3"
                                    value={formData.kemampuan3}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100"
                                    placeholder="Masukkan Kemampuan "
                                />
                            </td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">
                                <input
                                    type="number"
                                    name="nilai8"
                                    value={formData.nilai8}
                                    onChange={handleChange}
                                    className="w-full text-center bg-gray-100"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">4</td>
                            <td className="border border-black px-4 py-2 font-semibold">
                                <input
                                    type="text"
                                    name="kemampuan4"
                                    value={formData.kemampuan4}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100"
                                    placeholder="Masukkan Kemampuan"
                                />
                            </td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">
                                <input
                                    type="number"
                                    name="nilai9"
                                    value={formData.nilai9}
                                    onChange={handleChange}
                                    className="w-full text-center bg-gray-100"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">5</td>
                            <td className="border border-black px-4 py-2 font-semibold">
                                <input
                                    type="text"
                                    name="kemampuan5"
                                    value={formData.kemampuan5}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100"
                                    placeholder="Masukkan Kemampuan"
                                />
                            </td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">
                                <input
                                    type="number"
                                    name="nilai10"
                                    value={formData.nilai10}
                                    onChange={handleChange}
                                    className="w-full text-center bg-gray-100"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-6 space-x-4">
                <Link to="/app/rekapnilai">
                    <button className="btn btn-md border-blue-500 w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-700">Save</button>
                </Link>
                <Link to="/app/rekapnilai">
                    <button className="btn btn-md border-black w-full sm:w-auto">Close</button>
                </Link>
            </div>
        </div>
    );
};

export default LeadDetailsPage;
