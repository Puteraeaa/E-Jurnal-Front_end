import Cookies from "js-cookie";
import Api from "../../../api";
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart() {
  const token = Cookies.get("token");
  const [dashboard, setDashboard] = useState([]);
  const [chartData, setChartData] = useState({});
  const [filterBy, setFilterBy] = useState('month'); // 'day' or 'month'
  const [selectedMonth, setSelectedMonth] = useState(""); // Month selected when filterBy is 'day'
  const [loading, setLoading] = useState(true);
  const [availableMonths, setAvailableMonths] = useState([]);

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await Api.get(`/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDashboard(response.data.data);
      processChartData(response.data.data.attendance_breakdown);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (dashboard.attendance_breakdown) {
      processChartData(dashboard.attendance_breakdown);
    }
  }, [filterBy, selectedMonth]);

  const processChartData = (attendanceBreakdown) => {
    const monthData = {};
    const dailyData = {};

    attendanceBreakdown.forEach(item => {
      const date = new Date(item.period);
      const month = date.toLocaleString('default', { month: 'long' });
      const day = date.getDate();

      if (!monthData[month]) {
        monthData[month] = 0;
      }
      monthData[month] += item.count;

      if (!dailyData[month]) {
        dailyData[month] = {};
      }
      if (!dailyData[month][day]) {
        dailyData[month][day] = 0;
      }
      dailyData[month][day] += item.count;
    });

    setAvailableMonths(Object.keys(monthData));

    if (filterBy === 'month') {
      const labels = Object.keys(monthData);
      const data = Object.values(monthData);
      setChartData({
        labels,
        datasets: [
          {
            label: 'Data absen berdasarkan bulan',
            data,
            backgroundColor: 'rgba(53, 162, 235, 1)',
          },
        ],
      });
    } else if (filterBy === 'day' && selectedMonth) {
      const labels = Object.keys(dailyData[selectedMonth] || {});
      const data = labels.map(day => dailyData[selectedMonth][day] || 0);
      setChartData({
        labels,
        datasets: [
          {
            label: `Data absen per hari (${selectedMonth})`,
            data,
            backgroundColor: 'rgba(53, 162, 235, 1)',
          },
        ],
      });
    }
  };

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
    if (e.target.value === 'day') {
      setSelectedMonth(""); // Reset selectedMonth if changing to 'day'
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
  };

  return (
    <TitleCard 
      title="Statistik Data Absen"
      TopSideButtons={
        <div className="relative inline-block">
          <select
            value={filterBy}
            onChange={handleFilterChange}
            className="appearance-none w-32 h-10 text-sm p-2 pl-4 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          >
            <option value="day">Hari</option>
            <option value="month">Bulan</option>
          </select>
          {filterBy === 'day' && (
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="ml-4 appearance-none w-32 h-10 text-sm p-2 pl-4 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            >
              <option value="">Pilih Bulan</option>
              {availableMonths.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          )}
        </div>
      }
    >
      {loading ? (
        <div className="text-center">
          <p>Loading data...</p>
        </div>
      ) : (
        <div>
          {filterBy === 'day' && !selectedMonth ? (
            <p className="text-center text-gray-500">Silahkan pilih bulan</p>
          ) : (
            chartData.labels && <Bar options={options} data={chartData} />
          )}
        </div>
      )}
    </TitleCard>
  );
}

export default BarChart;
