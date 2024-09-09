import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { ClipLoader } from 'react-spinners';

const RequestPage = () => {
  const { eventId } = useParams();

  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:6001/organizer/show-requests/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPendingRequests(response.data.pendingRequests);
        setApprovedRequests(response.data.approvedRequests);
        setRejectedRequests(response.data.rejectedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [eventId]);

  const handleStatusChange = async (requestId, status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:6001/organizer/update-request/${requestId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedRequests = await axios.get(
        `http://localhost:6001/organizer/show-requests/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPendingRequests(updatedRequests.data.pendingRequests);
      setApprovedRequests(updatedRequests.data.approvedRequests);
      setRejectedRequests(updatedRequests.data.rejectedRequests);
    } catch (error) {
      console.error("Error updating request status:", error);
    } finally {
      setLoading(false);
    }
  };

  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const renderRequests = (requests) => {
    return (
      <div className="divide-y divide-gray-200">
        {requests.map((request, index) => (
          <div key={request._id} className="py-4">
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-gray-50 transition duration-200 rounded-lg px-8 py-4"
              onClick={() => toggleRow(index)}
            >
              <div className="flex-1 grid grid-cols-2 gap-6">
                <div className="text-base font-semibold text-teal-800">
                  {index + 1}. {request.studentName}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(request.requestDate).toLocaleDateString()}{" "}
                  {new Date(request.requestDate).toLocaleTimeString()}
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    request.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : request.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {request.status.toUpperCase()}
                </span>
                <select
                  value={request.status}
                  aria-label={`Change status for ${request.studentName}`}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(request._id, e.target.value)}
                  className="p-2 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  aria-label={`Toggle details for ${request.studentName}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRow(index);
                  }}
                  className="text-teal-600 hover:text-teal-800"
                >
                  {expandedRows[index] ? (
                    <ChevronUpIcon className="w-6 h-6" />
                  ) : (
                    <ChevronDownIcon className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
            {expandedRows[index] && (
              <div className="mt-4 pl-10">
                <h4 className="font-semibold text-teal-700 mb-3">Questions & Answers</h4>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-4">
                  {request.questions.map((question, i) => (
                    <div key={i}>
                      <p className="font-medium text-teal-600">{question}</p>
                      <p className="text-gray-800 bg-gray-100 p-3 rounded-md text-sm leading-relaxed">
                        {request.answers[i]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-14 px-6 md:px-12 lg:px-20">
      <div className="flex justify-center mb-12 space-x-8">
        {["pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            className={`py-3 px-10 font-medium text-sm rounded-full transition duration-200 ease-in-out ${
              activeTab === tab
                ? "bg-teal-700 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Requests
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#38B2AC" loading={loading} size={50} />
        </div>
      ) : (
        <>
          {activeTab === "pending" && renderRequests(pendingRequests)}
          {activeTab === "approved" && renderRequests(approvedRequests)}
          {activeTab === "rejected" && renderRequests(rejectedRequests)}
        </>
      )}
    </div>
  );
};

export default RequestPage;
