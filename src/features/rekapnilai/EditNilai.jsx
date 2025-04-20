import React, { useState, useEffect} from "react";
import Api from "../../api"; // Sesuaikan path impor jika perlu
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom"; // Menggunakan useParams untuk mendapatkan ID penilaian
import Swal from "sweetalert2"; // Import SweetAlert2
import { ToastContainer, toast } from "react-toastify"; // Import React Toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS untuk toast

const EditNilaiPage = () => {
    const navigate = useNavigate();
  const { id } = useParams(); // Mengambil ID dari URL
  const [studentId, setStudentId] = useState(""); // Simpan ID siswa
  const [productivityScores, setProductivityScores] = useState([
    { name: "", score: "" }
  ]); // Aspek Produktif
  const [loading, setLoading] = useState(false);
  const [personalityData, setPersonalityData] = useState({
    disiplinWaktu: "",
    kemampuanKerja: "",
    kualitasKerja: "",
    inisiatif: "",
    perilaku: ""
  });
  const [siswa, setSiswa] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // State untuk menyimpan data siswa yang dipilih
  const token = Cookies.get("token");

  // Fungsi untuk mengambil data penilaian berdasarkan ID
  const fetchNilaiDetail = async (id) => {
    try {
      const response = await Api.get(`/admin/penilaian/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Set data yang didapat ke state
      const { student_id, ...personalityScores } = response.data.data;
      setStudentId(student_id);
      setPersonalityData(personalityScores);
    } catch (error) {
      console.error("Error fetching nilai detail:", error);
    }
  };

  // Fungsi untuk mengambil daftar siswa
  const fetchSiswa = async () => {
    try {
      const response = await Api.get("/admin/Studentbyrole", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSiswa(response.data.data.data);
    } catch (error) {
      console.error("Error fetching siswa:", error);
    }
  };

  // Fungsi untuk mengambil nilai detail produktif berdasarkan ID siswa
  const fetchNilaiDetailProductivity = async (studentId) => {
    try {
      const response = await Api.get(
        `/admin/aspek-produktif/per-siswa?student_id=${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Pastikan response mengandung ID setiap score
      const scores = response.data.data.length > 0 ? response.data.data[0].scores : null;

      setProductivityScores(
        scores.map((score) => ({
          id: score.id || null,  // Pastikan ID disimpan
          name: score.name || "",
          score: score.score || ""
        }))
      );
    } catch (error) {
      console.error("Error fetching nilai detail produktif:", error);
    }
  };

  // Fungsi untuk mengambil detail siswa setelah memilih siswa
  const fetchStudentDetail = async (id) => {
    try {
      const response = await Api.get(`/admin/student/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Student detail response:", response.data.data); // Log detail siswa
      setSelectedStudent(response.data.data);
      setStudentId(response.data.data.id); // Simpan data siswa yang dipilih
    } catch (error) {
      console.error("Error fetching student detail:", error);
    }
  };

  // Fungsi untuk mengubah nilai dalam input field produktif
  const handleProductivityInputChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...productivityScores];
    list[index][name] = value;
    setProductivityScores(list);
  };

  // Fungsi untuk menambah kolom penilaian produktif
  const handleAddProductivityScore = () => {
    setProductivityScores([...productivityScores, { name: "", score: "" }]);
  };

  // Fungsi untuk menghapus kolom penilaian produktif
  

  // Fungsi untuk mengubah nilai dalam input field kepribadian
  const handlePersonalityInputChange = (field, value) => {
    setPersonalityData({ ...personalityData, [field]: value });
  };

  // Fungsi submit untuk mengirim data
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const hasEmptyFields = productivityScores.some(
      (score) => !score.name || score.score === ""
    );

    if (hasEmptyFields) {
      Swal.fire({
        icon: 'error',
        title: 'Kolom tidak lengkap',
        text: 'Pastikan semua kolom penilaian produktif terisi!',
      });
      setLoading(false);
      return;
    }

    try {
      for (const score of productivityScores) {
        if (score.id) {
          // Jika ada ID, gunakan PUT
          const productivityPayload = {
            student_id: studentId,
            name: score.name || "Tanpa Judul",
            score: score.score || "0"
          };

          await Api.put(`/admin/produktif/${score.id}`, productivityPayload, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          // Jika tidak ada ID, gunakan POST
          const newProductivityPayload = {
            student_id: studentId,
            name: score.name || "Tanpa Judul",
            score: score.score || "0"
          };

          await Api.post(`/admin/produktif`, newProductivityPayload, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
      }

      const personalityPayload = {
        student_id: studentId,
        ...personalityData
      };

      await Api.put(`/admin/penilaian/${id}`, personalityPayload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("Semua nilai telah diperbarui dengan sukses!"); // Toast for success
      navigate("/app/rekapnilai/detailnilai/" + id);
    } catch (error) {
      console.error("Error updating nilai:", error);
      toast.error("Gagal memperbarui nilai. Silakan coba lagi."); // Toast for error
    } finally {
      setLoading(false);
    }
  };

 // Fungsi untuk menghapus nilai produktif dari database
const handleDeleteProductivityScore = async (id) => {
    try {
      await Api.delete(`/admin/produktif/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Hapus nilai dari state
      setProductivityScores((prevScores) =>
        prevScores.filter((score) => score.id !== id)
      );
  
      toast.success("Nilai produktif berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting nilai produktif:", error);
      toast.error("Gagal menghapus nilai produktif.");
    }
  };
  
  // Fungsi untuk menghapus nilai dari state
  const handleRemoveProductivityScore = async (index) => {
    const scoreToRemove = productivityScores[index];
  
    // Jika score sudah ada di database, hapus dari database
    if (scoreToRemove.id) {
      const confirmDelete = await Swal.fire({
        title: 'Konfirmasi Hapus',
        text: "Apakah Anda yakin ingin menghapus nilai ini?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal'
      });
  
      if (confirmDelete.isConfirmed) {
        await handleDeleteProductivityScore(scoreToRemove.id); // Hapus dari database
        // Hapus nilai dari state
        setProductivityScores((prevScores) =>
          prevScores.filter((_, i) => i !== index)
        );
      }
    } else {
      // Jika tidak ada ID, cukup hapus dari state
      setProductivityScores((prevScores) =>
        prevScores.filter((_, i) => i !== index)
      );
    }
  };
  
  

  
  

  useEffect(() => {
    fetchSiswa();
    fetchNilaiDetail(id);
  }, [id]);

  useEffect(() => {
    if (studentId) {
      fetchStudentDetail(studentId);
      fetchNilaiDetailProductivity(studentId); // Memanggil fungsi untuk mendapatkan data produktif
    } else {
      setSelectedStudent(null); // Reset jika tidak ada siswa yang dipilih
      setProductivityScores([{ name: "", score: "" }]); // Reset nilai produktif
    }
  }, [studentId]);

  return (
    <div className="container mx-auto my-10 px-4">
  <ToastContainer /> {/* Tempat untuk menampilkan toast */}
  <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
    <h3 className="text-3xl font-bold text-center mb-4">Edit Penilaian</h3>
    <p className="text-center border-b pb-4 mb-4">Silakan isi form di bawah!</p>

    <form onSubmit={handleSubmit}>
      {/* <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Pilih Siswa</label>
        <select
          value={studentId}
          onChange={(e) => {
            const selectedId = e.target.value; // Simpan ID yang dipilih
            setStudentId(selectedId);
            fetchStudentDetail(selectedId); // Ambil detail siswa setelah dipilih
            console.log(selectedId); // Pastikan nilai diperbarui
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
      </div> */}

      <div className="mb-6 border p-4 rounded-md bg-gray-100">
        <h4 className="font-bold text-xl mb-2">Profil Siswa</h4>
        {selectedStudent ? (
          <div className="flex items-center">
            <img
              src={
                selectedStudent.image &&
                selectedStudent.image !==
                "https://api.jurnal.pplgsmkn1ciomas.my.id/storage"
                  ? selectedStudent.image
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" // Ganti dengan path gambar default
              }
              alt={selectedStudent.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <span>{selectedStudent.name}</span>
          </div>
        ) : (
          <p>Pilih siswa untuk melihat profil</p>
        )}
      </div>
      <div className="mb-6">
        <h4 className="font-bold text-xl mb-2">Nilai Kepribadian</h4>
        {Object.keys(personalityData).map((field) => (
          // Pastikan tidak merender 'id', 'created_at', atau 'updated_at'
          !['id', 'created_at', 'updated_at', 'industri_id',"industries",'students'].includes(field) && (
            <div key={field} className="mb-4">
              <label className="block text-gray-700 font-bold mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                value={personalityData[field]}
                onChange={(e) => handlePersonalityInputChange(field, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          )
        ))}
      </div>

      <div className="mb-6">
        <h4 className="font-bold text-xl mb-2">Aspek Produktif</h4>
        {productivityScores.map((score, index) => (
          <div key={index} className="flex mb-4">
            <label className="block text-gray-700 font-bold mt-1 w-[6%] text-center">
              Nilai {index + 1} 
            </label>
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
              className="w-50 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ml-2 mr-4"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveProductivityScore(index)}
              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            >
              Hapus
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddProductivityScore}
          className="flex items-center justify-center w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2" // Ukuran dan margin kanan untuk ikon
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Aspek Produktif
        </button>
      </div>

      <div className="flex justify-between gap-2">
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
          disabled={loading}
        >
          {loading ? "Mengupdate..." : "Update Nilai"}
        </button>
        <button
          type="button"
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
          onClick={() => navigate(`/app/rekapnilai/detailnilai/${id}`)} // Sesuaikan dengan rute yang diinginkan
        >
          Batal
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default EditNilaiPage;
