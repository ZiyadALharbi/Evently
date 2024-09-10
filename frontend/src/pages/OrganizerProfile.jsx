import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import DefaultPic from "/Users/ziyadalharbi/EVENT/frontend/src/assets/wallhaven-3lepy9.jpg";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null); 
  const [newProfileImage, setNewProfileImage] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
  
        const response = await axios.get(
          "https://evently-0e9w.onrender.com/organizer/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  

        const userPhoto = response.data.userInfo.photo ? response.data.userInfo.photo : DefaultPic;
        setUserInfo(response.data.userInfo);
        setProfileImage(userPhoto);
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfileData();
  }, []);
  

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
      .put("https://evently-0e9w.onrender.com/organizer/profile-picture", formData, {
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

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://evently-0e9w.onrender.com/organizer/delete-event/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete the event.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#38B2AC" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
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
              <strong>First Name:</strong> {userInfo.firstname}
            </div>
            <div>
              <strong>Last Name:</strong> {userInfo.lastname}
            </div>
            <div>
              <strong>Username:</strong> {userInfo.username}
            </div>
            <div>
              <strong>Email:</strong> {userInfo.email}
            </div>
            <div>
              <strong>Role:</strong> Organizer
            </div>
            <div>
              <strong>Phone number:</strong> {userInfo.phone}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-teal-700">Created Events</h2>
        {events.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {events.map((event, index) => (
              <div key={event._id} className="py-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1 grid grid-cols-2 gap-6">
                    <div className="text-base font-semibold text-teal-800">
                      {index + 1}. {event.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      <strong>Location:</strong> {event.location}
                    </div>
                    <div className="text-sm text-gray-500">
                      <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-8">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-200"
                      onClick={() => navigate(`/requests/${event._id}`)}
                    >
                      View Requests
                    </button>
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition duration-200"
                      onClick={() => navigate(`/EditEvent/${event._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200"
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No events created yet.</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;


