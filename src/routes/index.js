// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))

// Data User
const MainData = lazy(() => import('../pages/protected/Data-User/Data-User'))
const DataSiwa = lazy(() => import('../pages/protected/Data-User/Data-Siswa'))
const DataGuru = lazy(() => import('../pages/protected/Data-User/Data-Guru'))
const DataIndustri = lazy(() => import('../pages/protected/Data-User/Data-Industri'))
const DataOrangTua = lazy(() => import('../pages/protected/Data-User/Data-OrangTua'))

// Halaman Tambah dan Edit
const AddSiswaPage = lazy(() => import('../features/leads/DataSiswa/TambahSiswa'))
const EditSiswaPage = lazy(() => import('../features/leads/DataSiswa/EditSiswa'))

const AddGuruPage = lazy(() => import('../features/leads/DataGuru/TambahGuru'))
const EditGuruPage = lazy(() => import('../features/leads/DataGuru/EditGuru'))

const AddIndustriPage = lazy(() => import('../features/leads/DataIndustri/TambahIndustri'))
const EditIndustriPage = lazy(() => import('../features/leads/DataIndustri/EditIndustri'))

const AddOrangTuaPage = lazy(() => import('../features/leads/DataOrangTua/TambahOrangTua'))
const EditOrangTuaPage = lazy(() => import('../features/leads/DataOrangTua/EditOrangTua'))


const Integration = lazy(() => import('../pages/protected/Integration'))
const Calendar = lazy(() => import('../pages/protected/Calendar'))
const Team = lazy(() => import('../pages/protected/Team'))
const Transactions = lazy(() => import('../pages/protected/Transactions'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const Absen = lazy(() => import('../pages/protected/Absen'))
const Rekap = lazy(() => import('../pages/protected/Rekap'))

// laporan
const Laporan = lazy(() => import('../pages/protected/Laporan/Laporan'))
const AddLaporan = lazy(() => import('../features/Laporan/Add-Laporan'))
const DetailLAporan = lazy(() => import('../features/Laporan/DetailLaporan'))

const Jurusan = lazy(() => import('../pages/protected/Jurusan/Index'))


// nilai

const RekapNilai = lazy(() => import('../pages/protected/RekapNilai'))
const DetailNilai = lazy(() => import('../features/rekapnilai/DetailNilai'))
const EditNilai = lazy(() => import('../features/rekapnilai/EditNilai'))


const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/data',
    component: MainData,
  },
  {
    path: '/data/siswa',
    component: DataSiwa,
  },
  {
    path: '/data/siswa/tambah',
    component: AddSiswaPage,
  },
  {
    path: '/data/siswa/edit/:id',
    component: EditSiswaPage, 
  },
  {
    path: '/data/guru',
    component: DataGuru,
  },
  {
    path: '/data/guru/tambah',
    component: AddGuruPage, 
  },
  {
    path: '/data/guru/edit/:id',
    component: EditGuruPage, 
  },
  {
    path: '/data/industri',
    component: DataIndustri,
  },
  {
    path: '/data/industri/tambah',
    component: AddIndustriPage, 
  },
  {
    path: '/data/industri/edit/:id',
    component: EditIndustriPage, 
  },
  {
    path: '/data/orangtua',
    component: DataOrangTua,
  },
  {
    path: '/data/orangtua/tambah',
    component: AddOrangTuaPage,
  },
  {
    path: '/data/orangtua/edit/:id',
    component: EditOrangTuaPage, 
  },
  {
    path: '/settings-team',
    component: Team,
  },
  {
    path: '/calendar',
    component: Calendar,
  },
  {
    path: '/transactions',
    component: Transactions,
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
  },
  {
    path: '/settings-billing',
    component: Bills,
  },
  {
    path: '/integration',
    component: Integration,
  },
  
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
  {
    path: '/absensi',
    component: Absen,
  },
  {
    path: '/rekap-absensi',
    component: Rekap,
  },
  {
    path: '/laporan-pkl',
    component: Laporan,
  },
  {
    path: '/laporan-pkl/tambah',
    component: AddLaporan,
  },
  {
    path: 'detail-laporan/:id',
    component: DetailLAporan,
  },

  {
    path: '/data-kejuruan',
    component: Jurusan,
  },
  {
    path: '/rekapnilai',
    component: RekapNilai,
  },
  {
    path: '/rekapnilai/detailnilai/:id',
    component: DetailNilai,
  },
  {
    path: '/rekapnilai/editnilai/:id',
    component: EditNilai,
  },
  
]

export default routes
