import React, { useState, useEffect } from 'react';
import Api from '../../api'; // Sesuaikan path impor jika perlu
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import Swal from 'sweetalert2'; // Import Swal
import 'react-toastify/dist/ReactToastify.css'; // Import CSS untuk toast

const AddNilaiPage = () => {
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState('');
    const [productivityScores, setProductivityScores] = useState([{ name: '', score: '' }]);
    const [loading, setLoading] = useState(false);
    const [personalityData, setPersonalityData] = useState({
        disiplinWaktu: '',
        kemampuanKerja: '',
        kualitasKerja: '',
        inisiatif: '',
        perilaku: '',
    });
    const [siswa, setSiswa] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const token = Cookies.get('token');

    const handleAddProductivityScore = () => {
        setProductivityScores([...productivityScores, { name: '', score: '' }]);
    };

    const handleRemoveProductivityScore = (index) => {
        const updatedScores = productivityScores.filter((_, i) => i !== index);
        setProductivityScores(updatedScores);
    };

    const handleProductivityInputChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...productivityScores];
        list[index][name] = value;
        setProductivityScores(list);
        console.log(`Updated Score [${index}]:`, list[index]);
    };

    const handlePersonalityInputChange = (field, value) => {
        setPersonalityData({ ...personalityData, [field]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const hasEmptyFields = productivityScores.some(score => !score.name || score.score === '');
        
        if (hasEmptyFields) {
            toast.error('Pastikan semua kolom penilaian produktif terisi!'); 
            return;
        }

        try {
            for (const score of productivityScores) {
                const productivityPayload = {
                    student_id: studentId,
                    name: score.name || 'Tanpa Judul',
                    score: score.score || 0,
                };

                await Api.post('/admin/produktif', productivityPayload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            const personalityPayload = {
                student_id: studentId,
                ...personalityData,
            };

            await Api.post('/admin/penilaian', personalityPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        
            Swal.fire({
                icon: 'success',
                title: 'Sukses',
                text: 'Semua nilai telah dikirim dengan sukses!',
            });

            navigate('app/rekap-nilai');
        } catch (error) {
            console.error('Error adding nilai:', error);
            toast.error('Gagal mengirim nilai. Silakan coba lagi.'); // Tampilkan pesan error dengan toast
        } finally {
            setLoading(false);
        }
    };

    const fetchSiswa = async () => {
        try {
            const response = await Api.get('/admin/Studentbyrole', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSiswa(response.data.data.data);
        } catch (error) {
            console.error('Error fetching siswa:', error);
        }
    };

    const fetchStudentDetail = async (id) => {
        try {
            const response = await Api.get(`/admin/student/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSelectedStudent(response.data.data);
        } catch (error) {
            console.error('Error fetching student detail:', error);
        }
    };

    useEffect(() => {
        fetchSiswa();
    }, []);

    useEffect(() => {
        if (studentId) {
            fetchStudentDetail(studentId);
        } else {
            setSelectedStudent(null);
        }
    }, [studentId]);

    return (
        <div className="container mx-auto my-10 px-4">
       <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
    <h3 className="text-3xl font-bold text-center mb-4">Tambah Penilaian</h3>
    <p className="text-center border-b pb-4 mb-4">Silakan isi form di bawah!</p>

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2">Pilih Siswa</label>
                    <select
                        value={studentId}
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            setStudentId(selectedId);
                            fetchStudentDetail(selectedId);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="">Pilih Siswa</option>
                        {siswa.map((siswa) => (
                            <option key={siswa.id} value={siswa.id}>
                                {siswa.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6 border p-4 rounded-md bg-gray-100">
                    <h4 className="font-bold text-xl mb-2">Profil Siswa</h4>
                    {selectedStudent ? (
                        <div className="flex items-center">
                            <img
                                src={
                                    selectedStudent.image &&
                                    selectedStudent.image !== "https://api.jurnal.pplgsmkn1ciomas.my.id/storage"
                                        ? selectedStudent.image
                                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                }
                                alt="Profile"
                                className="w-16 h-16 rounded-full mr-4"
                            />
                            <span>{selectedStudent.name}</span>
                        </div>
                    ) : (
                        <p>Pilih siswa untuk melihat profil.</p>
                    )}
                </div>

                <h4 className="font-bold text-xl mb-2">Aspek Kepribadian</h4>
                {Object.keys(personalityData).map((field) => (
                    !['id', 'created_at', 'updated_at', 'industri_id', "industries", 'students'].includes(field) && (
                        <div key={field} className="mb-4">
                            <label className="block text-gray-700 font-bold mb-1">
                            {field.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').trim().slice(1)}
                            </label>
                            <input
                                type="text"
                                value={personalityData[field]}
                                onChange={(e) => handlePersonalityInputChange(field, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    )
                ))}

                <h4 className="font-bold text-xl mb-2">Aspek Produktif</h4>
                {productivityScores.map((score, index) => (
                    <div key={index} className="flex mb-4 pr-4">
                        <input
                            type="text"
                            name="name"
                            value={score.name}
                            onChange={(e) => handleProductivityInputChange(index, e)}
                            placeholder="Nama Aspek"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                        <input
                            type="number"
                            name="score"
                            value={score.score}
                            onChange={(e) => handleProductivityInputChange(index, e)}
                            placeholder="Nilai"
                            className="w-1/3 px-3 mr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ml-2"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveProductivityScore(index)}
                            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3-11a1 1 0 10-1.414-1.414L10 8.586 8.414 7A1 1 0 107 8.414L8.586 10 7 11.586A1 1 0 108.414 13L10 11.414 11.586 13A1 1 0 1013 11.586L11.414 10 13 8.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddProductivityScore}
                    className="flex items-center justify-center mb-6 w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Aspek Produktif
                </button>

                <div className="flex justify-between gap-2">
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
          disabled={loading}
        >
          {loading ? "Loading..." : "Simpan"}
        </button>
        <button
          type="button"
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
          onClick={() => navigate(`/app/rekapnilai`)} // Sesuaikan dengan rute yang diinginkan
        >
          Batal
        </button>
      </div>
            </form>
            </div>
            <div className="mt-6 card w-full p-6 bg-base-100 shadow-xl">
            <p className="text-lg font-semibold">Keterangan Nilai:</p>
            <ul className="list-disc ml-6 text-lg">
              <li>Nilai 80 - 100: <span className="font-bold text-green-600">A (Sangat Baik)</span></li>
              <li>Nilai 70 - 79: <span className="font-bold text-yellow-600">B (Baik)</span></li>
              <li>Nilai 60 - 69: <span className="font-bold text-orange-600">C (Cukup)</span></li>
              <li>Nilai 0 - 59: <span className="font-bold text-red-600">D (Kurang)</span></li>
            </ul>
          </div>
        </div>
    );
};

export default AddNilaiPage;
