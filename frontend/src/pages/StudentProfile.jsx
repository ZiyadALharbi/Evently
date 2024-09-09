// import DefaultPic from "/Users/ziyadalharbi/EVENT/frontend/src/assets/wallhaven-3lepy9.jpg";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiOutlineLocationMarker, HiOutlineClock } from "react-icons/hi";
import DefaultPic from "/Users/ziyadalharbi/EVENT/frontend/src/assets/wallhaven-3lepy9.jpg";

const StudentProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [requests, setRequests] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null); 
  const [newProfileImage, setNewProfileImage] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token provided");
      return;
    }

    axios
    .get("http://localhost:6001/student/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {

      const userPhoto = response.data.photo ? response.data.photo : DefaultPic;
      setProfile(response.data);
      setProfileImage(userPhoto); 
    })
    .catch((error) => console.error("Error fetching profile:", error));
  
    axios
      .get("http://localhost:6001/student/requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRequests(response.data))
      .catch((error) => console.error("Error fetching requests:", error));

    axios
      .get("http://localhost:6001/student/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setBookmarks(response.data))
      .catch((error) => console.error("Error fetching bookmarks:", error));
  }, []);

  const handleCancelRequest = (id) => {
    const token = localStorage.getItem("token");

    axios
      .delete(`http://localhost:6001/student/cancel-request/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setRequests(requests.filter((request) => request._id !== id));
      })
      .catch((error) => console.error("Error canceling request:", error));
  };

  const handleRemoveBookmark = (id) => {
    const token = localStorage.getItem("token");

    axios
      .delete(`http://localhost:6001/student/remove-bookmark/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setBookmarks(bookmarks.filter((bookmark) => bookmark.event._id !== id));
      })
      .catch((error) => console.error("Error removing bookmark:", error));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfileImage(file);
      setProfileImage(URL.createObjectURL(file)); 
    }
  };

  const handleProfileImageUpload = () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("photo", newProfileImage);

    axios
      .put("http://localhost:6001/student/profile-picture", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Profile image updated successfully!");
        setProfileImage(response.data.profileImage); 
      })
      .catch((error) => console.error("Error uploading profile image:", error));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      case "pending":
      default:
        return "text-yellow-500";
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Personal Information */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border border-gray-300 mb-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="text-sm text-gray-500"
            />
            {newProfileImage && (
              <button
                onClick={handleProfileImageUpload}
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Upload
              </button>
            )}
          </div>

          {/* Personal Info Section */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>First Name:</strong> {profile.firstname}
            </div>
            <div>
              <strong>Last Name:</strong> {profile.lastname}
            </div>
            <div>
              <strong>Username:</strong> {profile.username}
            </div>
            <div>
              <strong>Email:</strong> {profile.email}
            </div>
            <div>
              <strong>Role:</strong> Student
            </div>
            <div>
              <strong>Phone number:</strong> {profile.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Registered Events */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Registered Events
        </h2>
        {requests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {requests
              .filter((request) => request.eventId)
              .map((request) => {
                const event = request.eventId;
                const eventImage = event.eventImage || DefaultPic;
                const eventDate = event.date ? new Date(event.date) : null;
                const isPastEvent = eventDate && eventDate < new Date();
                const startTime = event.duration?.startTime || "8:00pm";
                const endTime = event.duration?.endTime || "10:30pm";

                return (
                  <div
                    key={request._id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transform transition duration-300 hover:scale-105"
                  >
                    {/* Event Image */}
                    <div className="relative">
                      <img
                        src={eventImage}
                        alt={event.title || "Event"}
                        className="rounded-t-lg w-full h-32 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-2 rounded-t-lg w-full">
                        <h3 className="text-lg font-bold text-white truncate">
                          {event.title || "Event Title"}
                        </h3>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                          {event.eventType || "General"}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {eventDate
                            ? eventDate.toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Date not available"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-700 text-sm font-semibold">
                        <div className="text-green-500 p-1 rounded-full">
                          <HiOutlineLocationMarker className="h-4 w-4" />
                        </div>
                        <span className="border-l-2 border-gray-300 pl-2">
                          {event.location || "Location not available"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600 text-xs">
                        <div className="text-green-500 p-1 rounded-full">
                          <HiOutlineClock className="h-4 w-4" />
                        </div>
                        <span className="border-l-2 border-gray-300 pl-2">
                          {startTime} - {endTime}
                        </span>
                      </div>

                      <div
                        className={`text-gray-700 font-semibold ${getStatusColor(
                          request.status
                        )}`}
                      >
                        Status: {request.status}
                      </div>

                      {isPastEvent ? (
                        <button
                          className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold py-1 rounded-lg shadow-md transition duration-300 hover:scale-105 cursor-default"
                          disabled
                        >
                          Ended
                        </button>
                      ) : request.status === "approved" ? (
                        <button
                          className="w-full bg-green-500/80 text-white font-bold py-1 rounded-lg shadow-md cursor-not-allowed"
                          disabled
                        >
                          Approved
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCancelRequest(request._id)}
                          className="w-full bg-gradient-to-r from-red-400 to-red-500 text-white font-bold py-1 rounded-lg shadow-md hover:from-red-500 hover:to-red-600 transition duration-300 hover:scale-105"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-gray-600">No registered events.</div>
        )}
      </div>

      {/* Bookmarked Events */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Bookmarked Events
        </h2>
        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bookmarks.map((bookmark) => {
              const event = bookmark.event || {};
              const eventImage = event.eventImage || DefaultPic;
              const eventDate = event.date ? new Date(event.date) : null;
              const startTime = event.duration?.startTime || "8:00pm";
              const endTime = event.duration?.endTime || "10:30pm";

              return (
                <div
                  key={bookmark._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transform transition duration-300 hover:scale-105"
                >
                  {/* Event Image */}
                  <div className="relative">
                    <img
                      src={eventImage}
                      alt={event.title || "Event"}
                      className="rounded-t-lg w-full h-32 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-2 rounded-t-lg w-full">
                      <h3 className="text-lg font-bold text-white truncate">
                        {event.title || "Event Title"}
                      </h3>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                        {event.eventType || "General"}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {eventDate
                          ? eventDate.toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Date not available"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-700 text-sm font-semibold">
                      <div className="text-green-500 p-1 rounded-full">
                        <HiOutlineLocationMarker className="h-4 w-4" />
                      </div>
                      <span className="border-l-2 border-gray-300 pl-2">
                        {event.location || "Location not available"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600 text-xs">
                      <div className="text-green-500 p-1 rounded-full">
                        <HiOutlineClock className="h-4 w-4" />
                      </div>
                      <span className="border-l-2 border-gray-300 pl-2">
                        {startTime} - {endTime}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveBookmark(bookmark.event._id)}
                      className="w-full bg-gradient-to-r from-red-400 to-red-500 text-white font-bold py-1 rounded-lg shadow-md hover:from-red-500 hover:to-red-600 transition duration-300 hover:scale-105"
                    >
                      Remove from Bookmarks
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-600">No bookmarked events.</div>
        )}
      </div>
    </div>
  );
};

export default StudentProfilePage;
