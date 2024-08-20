import React from "react";
import { useParams } from "react-router-dom";

const LessonDetailPage = () => {
  const { id } = useParams(); // Getting the lesson ID from URL parameters

  // Example static data for lesson and student profile
  const lesson = {
    judul: "Introduction to React",
    konten:
      "This material covers the basics of React, including components, state, and props.",
    dokumen: "https://example.com/sample.pdf", // URL to the PDF document
    waktuPengiriman: "2024-08-19" // Example date
  };

  const studentProfile = {
    nama: "John Doe",
    kelas: "12A",
    sekolah: "XYZ High School",
    foto: "https://via.placeholder.com/150" // URL to the student's profile picture
  };

  return (
    <section className="Materi">
      <div className="container mx-auto py-4 px-4 bg-white shadow-lg rounded-lg">
        <div
          className="text-center"
          data-aos="fade-down"
          data-aos-duration="1400"
        >
          <div className="text-black font-poppins">
            <p className="text-lg">Laporan PKL</p>
            <h1 className="text-4xl font-bold mt-1">{lesson.judul}</h1>
          </div>
        </div>
      </div>

      <div className="col-md-4 mt-3 bg-[#fff]">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <div className="flex items-center mb-4">
                  <img
                    src={studentProfile.foto}
                    alt={studentProfile.nama}
                    className="w-24 h-24 rounded-full border-2 border-gray-300"
                  />
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold">
                      {studentProfile.nama}
                    </h2>
                    <p className="text-gray-600">{studentProfile.kelas}</p>
                    <p className="text-gray-600">{studentProfile.sekolah}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

      <div className="container mt-4" data-aos="fade-down">
        <div className="row">
          <div className="col-md-8 mb-4">
            <div className="card border-0 shadow-lg bg-white">
              <div className="card-body p-5">
                <h1 className="text-2xl font-semibold">Deskripsi Laporan</h1>

                <p className="text-lg">
                  Pada hari ini, tugas yang diberikan kepada saya selama praktik
                  kerja lapangan di XYZ Tech Solutions adalah sebagai berikut:
                </p>
                <h3 className="text-xl font-semibold mt-4 mb-2">
                  Pengembangan Fitur Baru pada Aplikasi Web
                </h3>
                <p className="text-lg mb-4">
                  Tugas utama hari ini adalah mengembangkan fitur baru pada
                  aplikasi web yang sedang dikembangkan oleh tim pengembang di
                  XYZ Tech Solutions. Fitur yang diminta adalah penerapan sistem
                  notifikasi berbasis real-time menggunakan teknologi WebSocket.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
                  <h4 className="text-lg font-semibold mb-2">
                    Langkah Pertama:
                  </h4>
                  <p className="text-base mb-2">
                    Saya mulai dengan mempelajari dokumentasi dan arsitektur
                    sistem yang ada untuk memahami bagaimana fitur notifikasi
                    sebelumnya telah diimplementasikan. Ini melibatkan review
                    kode yang sudah ada, diskusi dengan anggota tim, dan
                    pemahaman tentang pustaka atau framework yang digunakan,
                    seperti Socket.IO.
                  </p>

                  <h4 className="text-lg font-semibold mb-2">Langkah Kedua:</h4>
                  <p className="text-base mb-2">
                    Setelah memahami sistem yang ada, saya melanjutkan dengan
                    menulis kode untuk mengintegrasikan WebSocket ke dalam
                    aplikasi. Ini termasuk membuat server WebSocket untuk
                    menangani komunikasi real-time dan memperbarui antarmuka
                    pengguna untuk menampilkan notifikasi secara dinamis.
                  </p>

                  <h4 className="text-lg font-semibold mb-2">
                    Langkah Ketiga:
                  </h4>
                  <p className="text-base">
                    Saya melakukan pengujian fitur dengan menggunakan alat
                    pengujian dan melibatkan anggota tim lainnya untuk
                    memastikan bahwa fitur berfungsi dengan baik di berbagai
                    kondisi jaringan dan perangkat. Saya juga memperbaiki bug
                    yang ditemukan selama pengujian.
                  </p>
                </div>

                <h3 className="text-xl font-semibold mt-4 mb-2">
                  Review Kode dan Penulisan Dokumentasi
                </h3>
                <p className="text-lg mb-4">
                  Selain tugas pengembangan fitur, saya juga diminta untuk
                  melakukan review kode yang ditulis oleh rekan tim lain dan
                  memberikan umpan balik tentang kualitas kode, kepatuhan
                  terhadap standar pemrograman, serta potensi perbaikan.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
                  <h4 className="text-lg font-semibold mb-2">
                    Langkah Pertama:
                  </h4>
                  <p className="text-base mb-2">
                    Saya membaca dan memeriksa kode yang ditulis oleh rekan tim,
                    mencari potensi masalah atau area yang dapat diperbaiki. Ini
                    termasuk memeriksa gaya penulisan kode, efisiensi algoritma,
                    dan pemanfaatan best practices.
                  </p>

                  <h4 className="text-lg font-semibold mb-2">Langkah Kedua:</h4>
                  <p className="text-base mb-2">
                    Setelah meninjau kode, saya memberikan umpan balik yang
                    konstruktif kepada penulis kode, termasuk saran untuk
                    perbaikan dan rekomendasi tentang cara meningkatkan kualitas
                    kode. Saya juga membuat catatan untuk dokumentasi terkait
                    dengan perubahan kode yang telah dilakukan.
                  </p>

                  <h4 className="text-lg font-semibold mb-2">
                    Langkah Ketiga:
                  </h4>
                  <p className="text-base">
                    Saya memperbarui dokumentasi proyek untuk mencerminkan
                    perubahan yang telah dibuat, termasuk menulis catatan rilis
                    dan memperbarui panduan penggunaan jika diperlukan.
                  </p>
                </div>

                <h3 className="text-xl font-semibold mt-4 mb-2">
                  Meeting Tim dan Diskusi Proyek
                </h3>
                <p className="text-lg mb-4">
                  Sebagai bagian dari kegiatan tim, saya mengikuti rapat
                  mingguan tim untuk membahas perkembangan proyek, tantangan
                  yang dihadapi, dan rencana kerja ke depan. Dalam rapat ini,
                  saya berkontribusi dengan berbagi kemajuan tugas saya dan
                  memberikan masukan tentang strategi pengembangan proyek.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
                  <h4 className="text-lg font-semibold mb-2">
                    Langkah Pertama:
                  </h4>
                  <p className="text-base mb-2">
                    Saya mempersiapkan laporan singkat mengenai kemajuan tugas
                    yang saya kerjakan dan persiapan materi presentasi untuk
                    rapat.
                  </p>

                  <h4 className="text-lg font-semibold mb-2">Langkah Kedua:</h4>
                  <p className="text-base">
                    Selama rapat, saya menyampaikan update mengenai fitur
                    notifikasi yang sedang dikembangkan, menjelaskan tantangan
                    yang dihadapi, dan mendiskusikan solusi yang telah
                    diterapkan. Saya juga mendengarkan masukan dari anggota tim
                    lain dan berdiskusi tentang rencana kerja ke depan.
                  </p>
                </div>

                <h2 className="text-2xl font-semibold mb-2">
                  Hasil dan Kesimpulan
                </h2>
                <p className="text-lg">
                  Hari ini merupakan hari yang produktif di mana saya berhasil
                  menyelesaikan pengembangan fitur baru dan memberikan
                  kontribusi melalui review kode dan dokumentasi. Pengalaman ini
                  memperluas pemahaman saya tentang pengembangan aplikasi web
                  real-time dan kolaborasi dalam tim pengembang. Selain itu,
                  saya mendapatkan wawasan berharga mengenai proses pengembangan
                  perangkat lunak dan pentingnya dokumentasi serta umpan balik
                  yang konstruktif.
                </p>
                <p className="text-lg">
                  Kedepannya, saya akan melanjutkan dengan pengujian lebih
                  lanjut dari fitur yang telah dikembangkan dan mulai
                  merencanakan tugas berikutnya sesuai dengan arahan dari tim.
                </p>

                <p className="text-black text-xs mt-2">
                  Materi di Upload {lesson.waktuPengiriman}
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default LessonDetailPage;
