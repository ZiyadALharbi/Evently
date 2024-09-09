import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { ClipLoader } from "react-spinners";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UsageStatistics = () => {
  const [usageStats, setUsageStats] = useState({
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
    eventsCreated: 0,
    registrationsCompleted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:6001/admin/usage-statistics", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsageStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching usage statistics:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={60} color={"#4A90E2"} loading={loading} />
      </div>
    );
  }

  const userActivityData = {
    labels: ["Daily", "Weekly", "Monthly"],
    datasets: [
      {
        label: "Active Users",
        data: [
          usageStats.dailyActiveUsers,
          usageStats.weeklyActiveUsers,
          usageStats.monthlyActiveUsers,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const eventStatisticsData = {
    labels: ["Events Created", "Registrations Completed"],
    datasets: [
      {
        label: "Event Statistics",
        data: [usageStats.eventsCreated, usageStats.registrationsCompleted],
        backgroundColor: ["rgba(75, 192, 192, 0.8)", "rgba(153, 102, 255, 0.8)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
        borderWidth: 2,
        borderRadius: 5,
        barThickness: 50,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
          color: "#6B7280",
        },
      },
      y: {
        grid: {
          borderDash: [5, 5],
          color: "#EAEAEA",
        },
        beginAtZero: true,
        ticks: {
          font: {
            size: 14,
          },
          color: "#6B7280",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#4B5563",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#F9FAFB",
        bodyColor: "#D1D5DB",
      },
    },
  };

  return (
    <div className="container mx-auto p-8 space-y-10">
      <h2 className="text-4xl font-extrabold text-center text-teal-600">
        Usage Statistics Dashboard
      </h2>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center transition-all duration-300 transform hover:scale-105">
          <h4 className="text-xl font-semibold text-teal-700">Daily Active Users</h4>
          <p className="text-3xl font-bold text-teal-900">{usageStats.dailyActiveUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center transition-all duration-300 transform hover:scale-105">
          <h4 className="text-xl font-semibold text-teal-700">Events Created</h4>
          <p className="text-3xl font-bold text-teal-900">{usageStats.eventsCreated}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center transition-all duration-300 transform hover:scale-105">
          <h4 className="text-xl font-semibold text-teal-700">Registrations Completed</h4>
          <p className="text-3xl font-bold text-teal-900">{usageStats.registrationsCompleted}</p>
        </div>
      </div>

      {/* Active Users Line Chart */}
      <div className="bg-white rounded-lg shadow-lg p-8" style={{ height: "400px" }}>
        <h3 className="text-2xl font-semibold mb-6 text-teal-700">Active Users Over Time</h3>
        <Line data={userActivityData} options={chartOptions} />
      </div>

      {/* Event Statistics Bar Chart */}
      <div className="bg-white rounded-lg shadow-lg p-8" style={{ height: "400px" }}>
        <h3 className="text-2xl font-semibold mb-6 text-teal-700">Event Statistics</h3>
        <Bar data={eventStatisticsData} options={chartOptions} />
      </div>
    </div>
  );
};

export default UsageStatistics;


