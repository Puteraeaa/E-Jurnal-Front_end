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


const Integration = lazy(() => import('../pages/protected/Integration'))
const Calendar = lazy(() => import('../pages/protected/Calendar'))
const Team = lazy(() => import('../pages/protected/Team'))
const Transactions = lazy(() => import('../pages/protected/Transactions'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))


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
    path: 'data/siswa',
    component: DataSiwa,
  },
  {
    path: 'data/guru',
    component: DataGuru,
  },
  {
    path: 'data/industri',
    component: DataIndustri,
  },
  {
    path: 'data/orangtua',
    component: MainData,
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
]

export default routes
