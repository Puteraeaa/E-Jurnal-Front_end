// src/routes/routes.js
import React, { lazy } from 'react';

// Lazy load components
const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Page404 = lazy(() => import('../pages/protected/404'));
const Blank = lazy(() => import('../pages/protected/Blank'));
const MainData = lazy(() => import('../pages/protected/Data-User/Data-User'));
const DataSiwa = lazy(() => import('../pages/protected/Data-User/Data-Siswa'));
const DataGuru = lazy(() => import('../pages/protected/Data-User/Data-Guru'));
const DataIndustri = lazy(() => import('../pages/protected/Data-User/Data-Industri'));
const DataOrangTua = lazy(() => import('../pages/protected/Data-User/Data-OrangTua'));
const AddSiswaPage = lazy(() => import('../features/leads/DataSiswa/TambahSiswa'));
const EditSiswaPage = lazy(() => import('../features/leads/DataSiswa/EditSiswa'));
const AddGuruPage = lazy(() => import('../features/leads/DataGuru/TambahGuru'));
const EditGuruPage = lazy(() => import('../features/leads/DataGuru/EditGuru'));
const AddIndustriPage = lazy(() => import('../features/leads/DataIndustri/TambahIndustri'));
const EditIndustriPage = lazy(() => import('../features/leads/DataIndustri/EditIndustri'));
const AddOrangTuaPage = lazy(() => import('../features/leads/DataOrangTua/TambahOrangTua'));
const EditOrangTuaPage = lazy(() => import('../features/leads/DataOrangTua/EditOrangTua'));
const Integration = lazy(() => import('../pages/protected/Integration'));
const Calendar = lazy(() => import('../pages/protected/Calendar'));
const Team = lazy(() => import('../pages/protected/Team'));
const Transactions = lazy(() => import('../pages/protected/Transactions'));
const Bills = lazy(() => import('../pages/protected/Bills'));
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'));
const editProfile = lazy(() => import('../pages/protected/EditProfile'));
const Absen = lazy(() => import('../pages/protected/Absen'));
const Rekap = lazy(() => import('../pages/protected/Rekap'));
const Laporan = lazy(() => import('../pages/protected/Laporan/Laporan'));
const AddLaporan = lazy(() => import('../features/Laporan/Add-Laporan'));
const DetailLaporan = lazy(() => import('../features/Laporan/DetailLaporan'));
const EditLaporan = lazy(() => import('../features/Laporan/Edit-Laporan'));
const Jurusan = lazy(() => import('../pages/protected/Jurusan-Kelas/Index'));
const Kelas = lazy(() => import('../pages/protected/Jurusan-Kelas/Kelas'));
const RekapNilai = lazy(() => import('../pages/protected/RekapNilai'));
const DetailNilai = lazy(() => import('../features/rekapnilai/DetailNilai'));
const EditNilai = lazy(() => import('../features/rekapnilai/EditNilai'));

// Route definitions
const routes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/data', element: <MainData /> },
  { path: '/data/siswa', element: <DataSiwa /> },
  { path: '/data/siswa/tambah', element: <AddSiswaPage /> },
  { path: '/data/siswa/edit/:id', element: <EditSiswaPage /> },
  { path: '/data/guru', element: <DataGuru /> },
  { path: '/data/guru/tambah', element: <AddGuruPage /> },
  { path: '/data/guru/edit/:id', element: <EditGuruPage /> },
  { path: '/data/industri', element: <DataIndustri /> },
  { path: '/data/industri/tambah', element: <AddIndustriPage /> },
  { path: '/data/industri/edit/:id', element: <EditIndustriPage /> },
  { path: '/data/orangtua', element: <DataOrangTua /> },
  { path: '/data/orangtua/tambah', element: <AddOrangTuaPage /> },
  { path: '/data/orangtua/edit/:id', element: <EditOrangTuaPage /> },
  { path: '/settings-team', element: <Team /> },
  { path: '/calendar', element: <Calendar /> },
  { path: '/transactions', element: <Transactions /> },
  { path: '/settings-profile', element: <ProfileSettings /> },
  { path: '/edit-profile/', element: <editProfile /> },
  { path: '/settings-billing', element: <Bills /> },
  { path: '/integration', element: <Integration /> },
  { path: '/absensi', element: <Absen /> },
  { path: '/rekap-absensi', element: <Rekap /> },
  { path: '/laporan-pkl', element: <Laporan /> },
  { path: '/laporan-pkl/tambah', element: <AddLaporan /> },
  { path: '/detail-laporan/:id', element: <DetailLaporan /> },
  { path: '/edit-laporan/:id', element: <EditLaporan /> },
  { path: '/data-kejuruan', element: <Jurusan /> },
  { path: '/data-kelas', element: <Kelas /> },
  { path: '/rekapnilai', element: <RekapNilai /> },
  { path: '/rekapnilai/detailnilai/:id', element: <DetailNilai /> },
  { path: '/rekapnilai/editnilai/:id', element: <EditNilai /> },
  { path: '/404', element: <Page404 /> },
  { path: '/blank', element: <Blank /> },
];

export default routes;
