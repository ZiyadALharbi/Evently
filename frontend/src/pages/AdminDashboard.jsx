import React, { useState } from "react";
import UserManagement from "../components/UserManagement.jsx";
import EventManagement from "../components/EventManagement.jsx";
import UsageStatistics from "../components/UsageStatistics.jsx";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li
            className={`cursor-pointer p-2 rounded ${
              activeTab === "users" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            User Management
          </li>
          <li
            className={`cursor-pointer p-2 rounded ${
              activeTab === "events" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("events")}
          >
            Event Management
          </li>
          <li
            className={`cursor-pointer p-2 rounded ${
              activeTab === "usage" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("usage")}
          >
            Usage Statistics
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="w-4/5 p-6">
        {activeTab === "users" && <UserManagement />}
        {activeTab === "events" && <EventManagement />}
        {activeTab === "usage" && <UsageStatistics />}
      </div>
    </div>
  );
};

export default AdminDashboard;
