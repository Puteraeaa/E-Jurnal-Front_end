import React from 'react';
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
            userProfile: {
                name: "Jane Smith",
                email: "jane.smith@example.com",
                phone: "987-654-3210",
                address: "456 Elm St, Othertown, USA"
            }
        },
    ];

    // Menemukan lead yang sesuai berdasarkan ID
    const currentLead = staticLeads.find(lead => lead.id === id);

    if (!currentLead) {
        return <div>Lead tidak ditemukan</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h3 className="font-bold text-3xl text-center mb-6">Detail Nilai</h3>

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
                            <td className="border border-black px-4 py-2 text-center font-semibold">{currentLead.nilai1}</td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">2</td>
                            <td className="border border-black px-4 py-2 font-semibold">Kemampuan Kerja/Motivasi</td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">{currentLead.nilai2}</td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">3</td>
                            <td className="border border-black px-4 py-2 font-semibold">Kualitas Kerja</td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">{currentLead.nilai3}</td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">4</td>
                            <td className="border border-black px-4 py-2 font-semibold">Inisiatif dan Kreatif</td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">{currentLead.nilai4}</td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">5</td>
                            <td className="border border-black px-4 py-2 font-semibold">Perilaku/Keselamatan Kerja</td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">{currentLead.nilai5}</td>
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
                            <td className="border border-black px-4 py-2 text-center font-semibold">{currentLead.nilai6}</td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">2</td>
                            <td className="border border-black px-4 py-2 font-semibold">Desain Grafis</td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">{currentLead.nilai7}</td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">3</td>
                            <td className="border border-black px-4 py-2 font-semibold"></td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">{currentLead.nilai8}</td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">4</td>
                            <td className="border border-black px-4 py-2 font-semibold"></td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">{currentLead.nilai9}</td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2 text-center font-semibold">5</td>
                            <td className="border border-black px-4 py-2 font-semibold"></td>
                            <td className="border border-black px-4 py-2 text-center font-semibold">{currentLead.nilai10}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Link to="/app/rekapnilai">
                <div className="flex justify-center mt-6">
                    <button className="btn btn-md border-black w-full sm:w-auto">Close</button>
                </div>
            </Link>
        </div>
    );
};

export default LeadDetailsPage;
