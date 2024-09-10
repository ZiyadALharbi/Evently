import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from "@heroicons/react/20/solid";
import { ClipLoader } from "react-spinners";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [eventPerformance, setEventPerformance] = useState([]);
  const [popularEvents, setPopularEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRows, setExpandedRows] = useState({});

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-lg p-3 rounded-lg">
          <p className="font-bold text-gray-700">{label}</p>
          <p className="text-green-600">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-blue-600">{`${payload[1].name}: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const eventRequests = await axios.get(
          "https://evently-0e9w.onrender.com/admin/event-requests",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const performance = await axios.get(
          "https://evently-0e9w.onrender.com/admin/event-performance-insights",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const popular = await axios.get(
          "https://evently-0e9w.onrender.com/admin/popular-events-tracking",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setEvents(eventRequests.data.requests);
        setEventPerformance(performance.data.events);
        setPopularEvents(popular.data.popularEvents);
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error("Error fetching event management data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `https://evently-0e9w.onrender.com/admin/approve-event/${id}`,
        { approved: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(events.filter((event) => event._id !== id));
    } catch (err) {
      setError("Error approving event.");
      console.error("Error approving event:", err);
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `https://evently-0e9w.onrender.com/admin/approve-event/${id}`,
        { approved: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(events.filter((event) => event._id !== id));
    } catch (err) {
      setError("Error rejecting event.");
      console.error("Error rejecting event:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <ClipLoader size={60} color={"#4A90E2"} loading={loading} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-10">
      <h2 className="text-4xl font-extrabold text-center text-teal-600">
        Event Management Dashboard
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Pending Event Approvals */}
      <div className="shadow-lg rounded-lg overflow-hidden bg-white ">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6">
          Pending Event Approvals
        </h3>
        <table className="w-full text-left table-auto bg-white">
          <thead>
            <tr className="bg-teal-50 text-teal-700">
              <th className="border-b py-4 px-6">Title</th>
              <th className="border-b py-4 px-6">Organizer</th>
              <th className="border-b py-4 px-6">Date</th>
              <th className="border-b py-4 px-6">Actions</th>
              <th className="border-b py-4 px-6"></th>{" "}
              {/* For Expand/Collapse button */}
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((request, index) => (
                <React.Fragment key={request._id}>
                  <tr
                    className="hover:bg-teal-50 transition duration-200 cursor-pointer"
                    onClick={() => toggleRow(index)}
                  >
                    <td className="border-b py-4 px-6">
                      {request.eventDetails.title}
                    </td>
                    <td className="border-b py-4 px-6">
                      {request.eventDetails.organizerName}
                    </td>
                    <td className="border-b py-4 px-6">
                      {new Date(request.eventDetails.date).toLocaleDateString()}
                    </td>
                    <td className="border-b py-4 px-6 flex space-x-4">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                        onClick={() => handleApprove(request._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                        onClick={() => handleReject(request._id)}
                      >
                        Reject
                      </button>
                    </td>
                    <td className="border-b py-4 px-6 text-right">
                      {expandedRows[index] ? (
                        <ChevronUpIcon className="w-6 h-6 text-teal-700" />
                      ) : (
                        <ChevronDownIcon className="w-6 h-6 text-teal-700" />
                      )}
                    </td>
                  </tr>
                  {expandedRows[index] && (
                    <tr>
                      <td colSpan="5" className="bg-teal-50 py-4 px-6">
                        <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-teal-600">
                          <h4 className="text-xl font-semibold text-teal-700 mb-4 flex items-center space-x-2">
                            <span>Event Details</span>
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Description */}
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Description:
                              </p>
                              <p className="text-gray-800 bg-teal-50 p-3 rounded-md text-sm leading-relaxed">
                                {request.eventDetails.description}
                              </p>
                            </div>

                            {/* Date */}
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Date:
                              </p>
                              <p className="text-gray-800 bg-teal-50 p-3 rounded-md text-sm leading-relaxed">
                                {new Date(
                                  request.eventDetails.date
                                ).toLocaleDateString()}
                              </p>
                            </div>

                            {/* Location */}
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Location:
                              </p>
                              <p className="text-gray-800 bg-teal-50 p-3 rounded-md text-sm leading-relaxed">
                                {request.eventDetails.location}
                              </p>
                            </div>

                            {/* Duration */}
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Duration:
                              </p>
                              <p className="text-gray-800 bg-teal-50 p-3 rounded-md text-sm leading-relaxed">
                                {request.eventDetails.duration.startTime} -{" "}
                                {request.eventDetails.duration.endTime}
                              </p>
                            </div>

                            {/* Tags */}
                            {request.eventDetails.tags.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Tags:
                                </p>
                                <p className="text-gray-800 bg-teal-50 p-3 rounded-md text-sm leading-relaxed">
                                  {request.eventDetails.tags.join(", ")}
                                </p>
                              </div>
                            )}

                            {/* Event Type */}
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Event Type:
                              </p>
                              <p className="text-gray-800 bg-teal-50 p-3 rounded-md text-sm leading-relaxed">
                                {request.eventDetails.eventType}
                              </p>
                            </div>

                            {/* Notes */}
                            {request.eventDetails.notes.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Notes:
                                </p>
                                <div className="text-gray-800 bg-teal-50 p-3 rounded-md text-sm leading-relaxed space-y-2">
                                  {request.eventDetails.notes.map(
                                    (note, index) => (
                                      <p key={index}>{note}</p>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No pending event requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Event Performance Insights */}
      <div className="shadow-lg rounded-lg overflow-hidden bg-white">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6">
          Event Performance Insights
        </h3>
        <div className="bg-green p-6">
          <div className="overflow-x-auto">
            <ResponsiveContainer
              width={eventPerformance.length * 100}
              height={400}
            >
              <BarChart
                data={eventPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barCategoryGap="15%"
              >
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="participantsCount"
                  fill="#82ca9d"
                  name="Participants"
                  barSize={30}
                />
                <Bar
                  dataKey="requestsCount"
                  fill="#2688d5"
                  name="Requests"
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Events */}
      <div className="shadow-lg rounded-lg overflow-hidden bg-white ">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 uppercase tracking-wider shadow-md">
          Popular Events
        </h3>
        <ul className="bg-white p-6 divide-y divide-teal-300">
          {popularEvents.length > 0 ? (
            popularEvents.map((event) => (
              <li
                key={event._id}
                className="py-4 flex justify-between items-center hover:bg-teal-50 transition duration-300 ease-in-out rounded-lg"
              >
                {/* Event Title */}
                <div>
                  <h4 className="text-xl font-bold text-teal-700">
                    {event.eventDetails.title}
                  </h4>
                </div>

                {/* Request Count */}
                <div className="flex items-center space-x-2">
                  <span className="bg-teal-600 text-white text-sm px-4 py-2 rounded-full shadow-md">
                    {event.requestsCount} Requests
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center py-6 text-teal-600">
              No popular events tracked.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EventManagement;
