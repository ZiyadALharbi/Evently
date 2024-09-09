import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [organizerRequests, setOrganizerRequests] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [activeUsersMetrics, setActiveUsersMetrics] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [userGrowth, setUserGrowth] = useState({
    weekly: 0,
    monthly: 0,
    total: 0,
  });
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");


    axios
      .get("http://localhost:6001/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUsers(response.data.users))
      .catch((error) => console.error("Error fetching users:", error));


    axios
      .get("http://localhost:6001/admin/organizer-requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setOrganizerRequests(response.data))
      .catch((error) =>
        console.error("Error fetching organizer requests:", error)
      );


    axios
      .get("http://localhost:6001/admin/active-users-metrics", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setActiveUsersMetrics(response.data))
      .catch((error) =>
        console.error("Error fetching active users metrics:", error)
      );


    axios
      .get("http://localhost:6001/admin/user-growth-tracking", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUserGrowth(response.data))
      .catch((error) =>
        console.error("Error fetching user growth data:", error)
      );

    axios
      .get("http://localhost:6001/admin/emails", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setEmails(response.data))
      .catch((error) => console.error("Error fetching emails:", error));
  }, []);

  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:6001/admin/manage-organizer-request/${id}`,
        { status: "approved" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrganizerRequests(
        organizerRequests.filter((request) => request._id !== id)
      );
    } catch (error) {
      console.error(
        "Error approving request:",
        error.response || error.message
      );
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:6001/admin/manage-organizer-request/${id}`,
        { status: "rejected" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrganizerRequests(
        organizerRequests.filter((request) => request._id !== id)
      );
    } catch (error) {
      console.error(
        "Error rejecting request:",
        error.response || error.message
      );
    }
  };


  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index], 
    }));
  };

  return (
    <div className="container mx-auto p-8 space-y-10">
      <h2 className="text-4xl font-extrabold text-center text-teal-600">
        User Management Dashboard
      </h2>

      {/* All Users Section */}
      <div className="shadow-lg rounded-lg overflow-hidden bg-white ">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6">
          All Users
        </h3>
        <table className="w-full text-left table-auto bg-white">
          <thead>
            <tr className="bg-teal-50 text-teal-700">
              <th className="border-b py-4 px-6">Username</th>
              <th className="border-b py-4 px-6">Role</th>
              <th className="border-b py-4 px-6">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <React.Fragment key={user._id}>
                <tr
                  className="hover:bg-teal-50 cursor-pointer transition duration-200"
                  onClick={() => toggleRow(index)}
                >
                  <td className="border-b py-4 px-6">{user.username}</td>
                  <td className="border-b py-4 px-6">{user.role}</td>
                  <td className="border-b py-4 px-6">{user.email}</td>
                </tr>
                {expandedRows[index] && (
                  <tr>
                    <td colSpan="3" className="border-b py-4 px-6 bg-teal-50">
                      <div className="p-4 bg-white rounded-lg shadow">
                        <h4 className="text-lg font-semibold text-teal-700 mb-2">
                          User Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <p className="text-gray-700">
                            <strong>First Name:</strong> {user.firstname}
                          </p>
                          <p className="text-gray-700">
                            <strong>Last Name:</strong> {user.lastname}
                          </p>
                          <p className="text-gray-700">
                            <strong>Username:</strong> {user.username}
                          </p>
                          <p className="text-gray-700">
                            <strong>Email:</strong> {user.email}
                          </p>
                          <p className="text-gray-700">
                            <strong>Phone:</strong> {user.phone || "N/A"}
                          </p>
                          <p className="text-gray-700">
                            <strong>Role:</strong> {user.role}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Organizer Requests Section */}
      <div className="shadow-lg rounded-lg overflow-hidden bg-white ">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6">
          Organizer Requests
        </h3>
        <ul className="bg-white p-6">
          {organizerRequests.map((request) => (
            <li
              key={request._id}
              className="py-3 border-b last:border-b-0 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold text-teal-700">
                  {request.firstname} {request.lastname}
                </p>
                <p className="text-gray-600">Username: {request.username}</p>
                <p className="text-gray-600">Email: {request.email}</p>
                <p className="text-gray-600">Phone: {request.phone}</p>
                <p className="text-gray-600">Status: {request.status}</p>
              </div>
              <div>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2 transition duration-200 hover:bg-green-600"
                  onClick={() => handleApprove(request._id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg transition duration-200 hover:bg-red-600"
                  onClick={() => handleReject(request._id)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Active Users Metrics Section */}
      <div className="shadow-lg rounded-lg overflow-hidden bg-white ">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6">
          Active Users Metrics
        </h3>
        <div className="grid grid-cols-3 gap-6 p-6 bg-white">
          <div className="p-4 bg-teal-100 rounded-lg shadow text-center transition-all duration-300 transform hover:scale-105">
            <h4 className="text-lg font-semibold text-teal-700">Daily Active Users</h4>
            <p className="text-2xl font-bold text-teal-900">
              {activeUsersMetrics.daily}
            </p>
          </div>
          <div className="p-4 bg-teal-100 rounded-lg shadow text-center transition-all duration-300 transform hover:scale-105">
            <h4 className="text-lg font-semibold text-teal-700">Weekly Active Users</h4>
            <p className="text-2xl font-bold text-teal-900">
              {activeUsersMetrics.weekly}
            </p>
          </div>
          <div className="p-4 bg-teal-100 rounded-lg shadow text-center transition-all duration-300 transform hover:scale-105">
            <h4 className="text-lg font-semibold text-teal-700">Monthly Active Users</h4>
            <p className="text-2xl font-bold text-teal-900">
              {activeUsersMetrics.monthly}
            </p>
          </div>
        </div>
      </div>

      {/* User Growth Section */}
      <div className="shadow-lg rounded-lg overflow-hidden bg-white ">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6">
          User Growth Tracking
        </h3>
        <ul className="bg-white p-6">
          <li className="py-3 border-b last:border-b-0 flex justify-between items-center">
            <span className="text-lg font-semibold text-teal-700">
              New Users This Week
            </span>
            <span className="text-teal-900">{userGrowth.weekly}</span>
          </li>
          <li className="py-3 border-b last:border-b-0 flex justify-between items-center">
            <span className="text-lg font-semibold text-teal-700">
              New Users This Month
            </span>
            <span className="text-teal-900">{userGrowth.monthly}</span>
          </li>
          <li className="py-3 flex justify-between items-center">
            <span className="text-lg font-semibold text-teal-700">
              Total Users
            </span>
            <span className="text-teal-900">{userGrowth.total}</span>
          </li>
        </ul>
      </div>

      {/* Subscribed Emails Section */}
      <div className="shadow-lg rounded-lg overflow-hidden bg-white ">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6">
          Subscribed Emails
        </h3>
        <table className="w-full text-left table-auto bg-white">
          <thead>
            <tr className="bg-teal-50 text-teal-700">
              <th className="border-b py-4 px-6">Email</th>
              <th className="border-b py-4 px-6">Date Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email._id} className="hover:bg-teal-50 transition duration-200">
                <td className="border-b py-4 px-6">{email.email}</td>
                <td className="border-b py-4 px-6">
                  {new Date(email.dateSubscribed).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

