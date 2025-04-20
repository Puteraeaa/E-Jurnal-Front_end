import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const rolesRoutes = {
  admin: [], // Admin tidak dibatasi, semua path bisa diakses
  siswa: [
    '/app/data/guru',
    '/app/data/industri',
    '/app/data/orangtua',
    '/app/settings-team',
    '/app/calendar',
    '/app/data-kejuruan',
    '/app/data-kelas',
  ],
  guru: [
    '/app/data/guru',
    '/app/data/industri',
    '/app/data/orangtua',
    '/app/settings-team',
    '/app/calendar',
    '/app/data-kejuruan',
    '/app/data-kelas',
    '/app/data/siswa/tambah',
    '/app/data/siswa/edit/:id',
  ],
  orangtua: [
    '/app/data/guru',
    '/app/data/industri',
    '/app/data/siswa',
    '/app/data/orangtua',
    '/app/settings-team',
    '/app/calendar',
    '/app/data-kejuruan',
    '/app/data-kelas',
  ],
  industri: [
    '/app/data/guru',
    '/app/data/industri',
    '/app/data/orangtua',
    '/app/settings-team',
    '/app/calendar',
    '/app/data-kejuruan',
    '/app/data-kelas',
  ],
};

const PrivateRoutes = ({ children }) => {
  const location = useLocation(); // Mengambil lokasi rute saat ini
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const userRole = user?.roles; // Ambil role pengguna jika tersedia

  // Fungsi untuk memeriksa apakah pengguna diizinkan mengakses rute tertentu
  const isAuthorized = (path) => {
    if (!userRole) return false; // Jika userRole tidak ada, berarti pengguna belum login atau tidak terautentikasi

    const restrictedPaths = rolesRoutes[userRole] || [];
    
    if (restrictedPaths.length === 0) return true; // Jika admin, tidak ada pembatasan rute

    return !restrictedPaths.includes(path); // Return true jika path tidak ada dalam daftar rute yang dibatasi
  };

  // Jika pengguna tidak login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Jika pengguna tidak diizinkan mengakses rute
  if (!isAuthorized(location.pathname)) {
    return <Navigate to="/403" replace />;
  }

  return children; // Jika diizinkan, render komponen anak
};

export default PrivateRoutes;
