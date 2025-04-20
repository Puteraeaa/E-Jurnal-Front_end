import React from 'react';
import {
  Squares2X2Icon,
  TableCellsIcon,
  UserIcon,
  CalendarDaysIcon,
  InboxArrowDownIcon,
  DocumentDuplicateIcon,
  RectangleStackIcon,
  ChatBubbleLeftIcon,
  CursorArrowRippleIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';


import hasAnyPermission from '../utils/Permissions';

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;



const routes = (archivedData = []) => {
  return [
  {
    path: 'dashboard',
    icon: <Squares2X2Icon className={iconClasses} />, 
    name: 'Dashboard',
  },
  ...(hasAnyPermission(['users.create', 'penilaian.create']) ? [
  {
    path: '', //no url needed as this has submenu
    icon: <TableCellsIcon className={`${iconClasses} inline`} />, // icon component
    name: 'Data User', // name that appear in Sidebar
    submenu: [
      {
        path: 'data/siswa', //url
        icon: <UserIcon className={submenuIconClasses} />, // icon component
        name: 'Data Siswa', // name that appear in Sidebar
      },
      ...(hasAnyPermission(['users.create']) ? [
      {
        path: 'data/guru',
        icon: <UserIcon className={submenuIconClasses} />,
        name: 'Data Guru',
      },
      
      {
        path: 'data/industri',
        icon: <UserIcon className={submenuIconClasses} />,
        name: 'Data Industri',
      },
      {
        path: 'data/orangtua',
        icon: <UserIcon className={submenuIconClasses} />,
        name: 'Data Orang Tua',
      },
    ] : []),
    ],
  },
  ] : []),
  ...(hasAnyPermission(['users.create']) ? [
  {
    path: '/app/data-kejuruan', // url
    icon: <i className="fa-solid fa-school text-gray-500 text-xl"></i>, // icon component
    name: 'Data Kejuruan', // name that appear in Sidebar
  },
  {
    path: '/app/data-kelas', // url
    icon: <i className="fa-solid fa-school text-gray-500 text-xl"></i>, // icon component
    name: 'Data Kelas', // name that appear in Sidebar
  },
  ] : []),
  ...(hasAnyPermission(['guru.index', 'orang-tua.index','users.create','murid.index']) ? [
  {
    path: '/app/forum', //url
    icon: <ChatBubbleLeftIcon className={submenuIconClasses} />,
    name: 'Forum PKL', // name that appear in Sidebar
  },
  ] : []),
  {
    path: '/app/integration', // url
    icon: <i className="fa-solid fa-circle-info text-gray-500 text-xl"></i>, // icon component
    name: 'Panduan PKL', // name that appear in Sidebar
  },
 
  ...(hasAnyPermission(['murid.index']) ? [
  {
    path: '/app/absensi', // url
    icon: <UserIcon className={iconClasses} />, // icon component
    name: 'Absen', // name that appear in Sidebar
  },
  
] : []),

{
  path: '/app/bimbingan/form', //url
  icon: <RectangleStackIcon className={submenuIconClasses} />,
  name: 'Bimbingan', // name that appear in Sidebar
},

...(hasAnyPermission(['guru.index', 'orang-tua.index', 'tempat.index', 'users.create']) ? [
  {
    path: '/app/rekap-absensi',
    icon: <UserIcon className={iconClasses} />,
    name: 'Data absen',
  },
  ...(hasAnyPermission([ 'users.create']) ? [
  {
    path: '/app/calendar', // url
    icon: <CalendarDaysIcon className={iconClasses} />, // icon component
    name: 'Calendar', // name that appear in Sidebar
  },
  {
    path: '/app/cms', // url
    icon: <CursorArrowRippleIcon className={iconClasses} />, // icon component
    name: 'CMS', 
  },


  ] : []),
] : []),


  {
    path: '/app/laporan-pkl', // url
    icon: <InboxArrowDownIcon className={iconClasses} />, // icon component
    name: 'Jurnal Laporan Harian', // name that appear in Sidebar 
  },
  {
    path: '/app/rekapnilai', // url
    icon: <DocumentDuplicateIcon className={iconClasses}/>, // icon component
    name: 'Rekap Penilaian', // name that appear in Sidebar
  },
  {
    path: '/app/settings-profile', //url
    icon: <UserIcon className={submenuIconClasses} />,
    name: 'Profile', // name that appear in Sidebar
  },

    ...(hasAnyPermission(['users.create', 'penilaian.create']) ? [
      {
        path: '',
        icon: <ArchiveBoxIcon className={`${iconClasses} inline`} />,
        name: 'Archived Students',
        submenu: Array.isArray(archivedData)
          ? archivedData.map((item) => ({
              path: `/app/archived/${item.year}`,
              icon: <CalendarDaysIcon className={submenuIconClasses} />,
              name: item.year,
            }))
          : [],
      },
    ] : []),
 
 
  // {
  //   path: '', //no url needed as this has submenu
  //   icon: <DocumentDuplicateIcon className={`${iconClasses} inline`} />, // icon component
  //   name: 'Pages', // name that appear in Sidebar
  //   submenu: [
  //     {
  //       path: '/login',
  //       icon: <ArrowRightOnRectangleIcon className={submenuIconClasses} />,
  //       name: 'Login',
  //     },
  //     {
  //       path: '/forgot-password',
  //       icon: <KeyIcon className={submenuIconClasses} />,
  //       name: 'Forgot Password',
  //     },
  //     {
  //       path: '/app/blank',
  //       icon: <DocumentIcon className={submenuIconClasses} />,
  //       name: 'Blank Page',
  //     },
  //     {
  //       path: '/app/404',
  //       icon: <ExclamationTriangleIcon className={submenuIconClasses} />,
  //       name: '404',
  //     },
  //   ],
  // },
  // // {
  // //   path: '', //no url needed as this has submenu
  // //   icon: <Cog6ToothIcon className={`${iconClasses} inline`} />, // icon component
  // //   name: 'Settings', // name that appear in Sidebar
  // //   submenu: [
      
  // //     // {
  // //     //   path: '/app/settings-billing',
  // //     //   icon: <WalletIcon className={submenuIconClasses} />,
  // //     //   name: 'Billing',
  // //     // },
  // //     // {
  // //     //   path: '/app/settings-team', // url
  // //     //   icon: <UsersIcon className={submenuIconClasses} />,
  // //     //   name: 'Team Members', // name that appear in Sidebar
  // //     // },
  // //   ],
  // },

  
]};

export default routes;
