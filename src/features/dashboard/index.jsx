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
import  SiswaPage  from "./components/Siswa";
import  SiswaPage2 from "./components/Siswa-2";

// guru component

import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";

import { useState } from "react";
import hasAnyPermission from "../../utils/Permissions";



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
      {hasAnyPermission(["murid.index", "guru.index", "orang-tua.index","tempat.index"]) && (
        <>
            <div className="grid lg:grid-cols-2 mt-1 grid-cols-1 gap-6">
            <SiswaPage/>
         
          
            
            </div>

<div className="grid  mt-1 grid-cols-1 ">


<SiswaPage2/>

</div>

</>
 
        )}

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
