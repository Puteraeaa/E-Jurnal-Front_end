import React from 'react';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon';
import WalletIcon from '@heroicons/react/24/outline/WalletIcon';
import CodeBracketSquareIcon from '@heroicons/react/24/outline/CodeBracketSquareIcon';
import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon';
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon';
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon';
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon';
import BoltIcon from '@heroicons/react/24/outline/BoltIcon';
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon';
import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
import KeyIcon from '@heroicons/react/24/outline/KeyIcon';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';

import hasAnyPermission from '../utils/Permissions';

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const routes = [
  {
    path: 'dashboard',
    icon: <Squares2X2Icon className={iconClasses} />, 
    name: 'Dashboard',
  },
  ...(hasAnyPermission(['users.index']) ? [
  {
    path: '', //no url needed as this has submenu
    icon: <TableCellsIcon className={`${iconClasses} inline`} />, // icon component
    name: 'Data User', // name that appear in Sidebar
    submenu: [
      {
        path: 'data',
        icon: <UserIcon className={submenuIconClasses} />,
        name: 'Main Data',
      },
      {
        path: 'data/siswa', //url
        icon: <UserIcon className={submenuIconClasses} />, // icon component
        name: 'Data Siswa', // name that appear in Sidebar
      },
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
        path: '/app/404',
        icon: <UserIcon className={submenuIconClasses} />,
        name: 'Data Orang Tua',
      },
    ],
  },
  ] : []),
  ...(hasAnyPermission(['users.index']) ? [
  {
    path: '/app/data-kejuruan', // url
    icon: <i className="fa-solid fa-school text-gray-500 text-xl"></i>, // icon component
    name: 'Data Kejuruan', // name that appear in Sidebar
  },
  ] : []),
  {
    path: '/app/integration', // url
    icon: <i className="fa-solid fa-circle-info text-gray-500 text-xl"></i>, // icon component
    name: 'Panduan PKL', // name that appear in Sidebar
  },
  {
    path: '/app/calendar', // url
    icon: <CalendarDaysIcon className={iconClasses} />, // icon component
    name: 'Calendar', // name that appear in Sidebar
  },
  {
    path: '/app/absensi', // url
    icon: <UserIcon className={iconClasses} />, // icon component
    name: 'Absen', // name that appear in Sidebar
  },
  {
    path: '/app/laporan-pkl', // url
    icon: <InboxArrowDownIcon className={iconClasses} />, // icon component
    name: 'Laporan PKL', // name that appear in Sidebar 
  },
  {
    path: '/app/rekapnilai', // url
    icon: <DocumentDuplicateIcon className={iconClasses}/>, // icon component
    name: 'Rekap Penilaian', // name that appear in Sidebar
  },
  {
    path: '', //no url needed as this has submenu
    icon: <DocumentDuplicateIcon className={`${iconClasses} inline`} />, // icon component
    name: 'Pages', // name that appear in Sidebar
    submenu: [
      {
        path: '/login',
        icon: <ArrowRightOnRectangleIcon className={submenuIconClasses} />,
        name: 'Login',
      },
      {
        path: '/forgot-password',
        icon: <KeyIcon className={submenuIconClasses} />,
        name: 'Forgot Password',
      },
      {
        path: '/app/blank',
        icon: <DocumentIcon className={submenuIconClasses} />,
        name: 'Blank Page',
      },
      {
        path: '/app/404',
        icon: <ExclamationTriangleIcon className={submenuIconClasses} />,
        name: '404',
      },
    ],
  },
  {
    path: '', //no url needed as this has submenu
    icon: <Cog6ToothIcon className={`${iconClasses} inline`} />, // icon component
    name: 'Settings', // name that appear in Sidebar
    submenu: [
      {
        path: '/app/settings-profile', //url
        icon: <UserIcon className={submenuIconClasses} />,
        name: 'Profile', // name that appear in Sidebar
      },
      // {
      //   path: '/app/settings-billing',
      //   icon: <WalletIcon className={submenuIconClasses} />,
      //   name: 'Billing',
      // },
      // {
      //   path: '/app/settings-team', // url
      //   icon: <UsersIcon className={submenuIconClasses} />,
      //   name: 'Team Members', // name that appear in Sidebar
      // },
    ],
  },
];

export default routes;
