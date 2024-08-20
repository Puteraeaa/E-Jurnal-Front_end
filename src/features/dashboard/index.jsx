import DashboardStats from "./components/DashboardStats";
import AmountStats from "./components/AmountStats";
import PageStats from "./components/PageStats";

// admin component
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import UserChannels from "./components/UserChannels";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";

// siswa component
import SiswaPage from "./components/Siswa";

// guru component

import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";

import { useState } from "react";
import hasAnyPermission from "../../utils/Permissions";

const statsData = [
  {
    title: "New Users",
    value: "34.7k",
    icon: <UserGroupIcon className="w-8 h-8" />,
    description: "↗︎ 2300 (22%)"
  },
  {
    title: "Total Sales",
    value: "$34,545",
    icon: <CreditCardIcon className="w-8 h-8" />,
    description: "Current month"
  },
  {
    title: "Pending Leads",
    value: "450",
    icon: <CircleStackIcon className="w-8 h-8" />,
    description: "50 in hot leads"
  },
  {
    title: "Active Users",
    value: "5.6k",
    icon: <UsersIcon className="w-8 h-8" />,
    description: "↙ 300 (18%)"
  }
];

function Dashboard() {
  const dispatch = useDispatch();

  const updateDashboardPeriod = (newRange) => {
    // Dashboard range changed, write code to refresh your values
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1
      })
    );
  };

  return (
    <>
      {/** ---------------------- Select Period Content ------------------------- */}
        {/* {hasAnyPermission(["absen.index"]) && (
            <div className="grid lg:grid-cols-2 mt-1 grid-cols-1 gap-6">
            <SiswaPage/>
          </div>
        )} */}
      

      {/** ---------------------- Different stats content 1 ------------------------- */}

      {hasAnyPermission(["siswa.delete"]) && (
        <div className="grid lg:grid-cols-2 mt-1 grid-cols-1 gap-6">
          <AmountStats />
        </div>
      )}

      {/** ---------------------- Different charts ------------------------- */}
      {hasAnyPermission(["siswa.delete"]) && (
        <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
          <LineChart />
          <BarChart />
        </div>
      )}

      {/** ---------------------- Different stats content 2 ------------------------- */}

      {/** ---------------------- User source channels table  ------------------------- */}
    </>
  );
}

export default Dashboard;
