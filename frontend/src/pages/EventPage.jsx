import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineBookmark } from "react-icons/hi";
import moment from "moment";
import Footer from "../components/Footer.jsx";
import DefaultPic from "../assets/wallhaven-3lepy9.jpg";  
import Profile from "../assets/profile.png"; 

function EventPage() {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        console.log("Fetching event data for eventId:", eventId);  
        const response = await axios.get(`http://localhost:6001/general/event/${eventId}`);
        console.log("Event data fetched:", response.data); 
        setEventData(response.data);
      } catch (error) {
        console.error("Error fetching event data:", error);  
        setMessage({
          type: "error",
          text: "Failed to fetch event data. Please try again later.",
        });
      }
    };

    fetchEventData();
  }, [eventId]);

  const formattedDate = moment(eventData.date).format("DD MMM YYYY");

  const handleRegister = () => {
    navigate(`/form/${eventId}`);
  };

  const handleBookmark = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:6001/student/add-bookmark/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setMessage({ type: "success", text: "Event bookmarked successfully!" });
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Failed to bookmark event.",
        });
      });
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          {/* Event Image */}
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-md">
            <img
              src={eventData.eventImage || DefaultPic}
              alt="Event"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-4 w-full">
              <h1 className="text-3xl font-bold text-white">
                {eventData.title}
              </h1>
            </div>
          </div>

          {/* Event Details */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column (Event Info) */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <HiOutlineLocationMarker className="h-6 w-6 text-teal-500 mr-2" />
                  <span className="text-lg text-gray-700">
                    {eventData.location}
                  </span>
                </div>
                <div className="flex items-center mb-6">
                  <HiOutlineClock className="h-6 w-6 text-teal-500 mr-2" />
                  <span className="text-lg text-gray-700">
                    {formattedDate} | {eventData.duration?.startTime || "8:00pm"} - {eventData.duration?.endTime || "10:30pm"}
                  </span>
                </div>

                {/* Tags and Event Type */}
                {eventData.eventType && (
                  <div className="mb-6">
                    <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">
                      {eventData.eventType}
                    </span>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap mb-6">
                  {eventData.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-teal-100 text-teal-700 rounded-full px-4 py-1 text-sm font-medium mr-2 mb-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {eventData.description}
                </p>
              </div>
            </div>

            {/* Right Column (Actions, Organizer Info, and Notes) */}
            <div className="flex flex-col space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center transform transition duration-300 hover:scale-105">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Hosted by {eventData.organizerName}
                </h2>
                <img
                  src={eventData.organizerId?.photo || Profile}
                  alt="Organizer"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <button
                  className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 rounded-lg shadow-md hover:from-teal-500 hover:to-green-400 transition duration-300 mb-4 hover:scale-105"
                  onClick={handleRegister}
                >
                  Register
                </button>
                <button
                  className="w-full bg-yellow-500 text-white py-3 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                  onClick={handleBookmark}
                >
                  <HiOutlineBookmark className="h-5 w-5" />
                  <span>Bookmark</span>
                </button>
              </div>

              {/* Notes Section in Right Column */}
              <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-300 transform hover:scale-105 ">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Notes:</h4>
                {eventData.notes && eventData.notes.length > 0 ? (
                  <ul className="list-disc pl-6 space-y-2">
                    {eventData.notes.map((note, index) => (
                      <li key={index} className="text-gray-600">
                        {note}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-red-600/90 font-semibold">
                    No additional notes provided for this event.
                  </div>
                )}
              </div>

              {/* Display success or error message */}
              {message && (
                <div
                  className={`p-4 rounded-lg text-center transform transition-all duration-500 ease-in-out ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EventPage;

