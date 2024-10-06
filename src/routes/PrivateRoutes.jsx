import React from 'react';
import { Navigate } from 'react-router-dom';
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
      '/app/data/siswa',
      '/app/data/orangtua',
      '/app/settings-team',
      '/app/calendar',
      '/app/data-kejuruan',
      '/app/data-kelas',
    ],
  };
  

const PrivateRoutes = ({ children }) => {
  const user = JSON.parse(Cookies.get("user"));
  const userRole = user?.roles; // Ambil role pengguna

  // Memeriksa apakah path yang ingin diakses ada dalam daftar rute yang tidak diizinkan untuk role ini
  const isAuthorized = (path) => {
    if (!userRole) return false; // Jika role tidak ada, berarti user tidak terautentikasi

    const forbiddenPaths = rolesRoutes[userRole] || [];
    console.log("User Role:", userRole); // Debugging: lihat role pengguna
    console.log("Attempted Path:", path); // Debugging: lihat path yang dicoba

    return !forbiddenPaths.includes(path); // Jika path tidak ada dalam forbiddenPaths, return true
  };

  // Cek akses rute
  return (
    <>
      {isAuthorized(window.location.pathname) ? (
        children
      ) : (
        <Navigate to="/403" replace /> // Halaman Forbidden
      )}
    </>
  );
};

export default PrivateRoutes;
