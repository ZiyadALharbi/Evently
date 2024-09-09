import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineLocationMarker, HiOutlineClock } from "react-icons/hi";
import DefaultPic from "/Users/ziyadalharbi/EVENT/frontend/src/assets/wallhaven-3lepy9.jpg";
import Footer from "../components/Footer.jsx";

function Events() {
  const [events, setEvents] = useState([]);
  const [rows, setRows] = useState(3);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");

  const location = useLocation();


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromQuery = queryParams.get("category");


    if (categoryFromQuery && categoryFromQuery !== filter) {
      setFilter(categoryFromQuery);
    }
  }, [location.search]);


  useEffect(() => {
    let isMounted = true; 
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6001/general/events",
          {
            params: { filter, sortBy },
          }
        );
        if (isMounted) {
          setEvents(response.data.events);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching events:", error);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, [filter, sortBy]);

  const handleMore = () => {
    setRows((prevRows) => prevRows + 3);
  };

  const eventTypes = [
    "All",
    "Conference",
    "Workshop",
    "Seminar",
    "Bootcamp",
    "Lecture",
    "Hackathon",
    "Cultural Event",
    "Volunteer",
  ];

  const sortOptions = ["popularity", "recent", "old"];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 py-12">
        <div className="container mx-auto px-4">
          {/* Filter and Sort Options */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 rounded-lg py-2 px-4 shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 rounded-lg py-2 px-4 shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events.slice(0, rows * 4).map((event) => {
              const eventImage = event.eventImage || DefaultPic;
              const startTime = event.duration?.startTime || "8:00pm";
              const endTime = event.duration?.endTime || "10:30pm";
              return (
                <Link
                  key={event._id}
                  to={`/EventPage/${event._id}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transform transition duration-500 hover:scale-105"
                >
                  {/* Event Image */}
                  <div className="relative">
                    <img
                      src={eventImage}
                      alt={event.title}
                      className="rounded-t-lg w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-t-lg w-full">
                      <h3 className="text-xl font-bold text-white truncate">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      {/* Event Type Tag */}
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                        {event.eventType || "General"}
                      </span>
                      {/* Date */}
                      <span className="text-gray-500 text-sm">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-3 text-gray-700 text-md font-semibold">
                      <div className="text-green-500 p-2 rounded-full">
                        <HiOutlineLocationMarker className="h-5 w-5" />
                      </div>
                      <span className="border-l-2 border-gray-300 pl-3">
                        {event.location}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center space-x-3 text-gray-600 text-sm">
                      <div className="text-green-500 p-2 rounded-full">
                        <HiOutlineClock className="h-5 w-5" />
                      </div>
                      <span className="border-l-2 border-gray-300 pl-3">
                        {startTime} - {endTime}
                      </span>
                    </div>

                    {/* Register Button */}
                    <button className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold py-2 rounded-lg shadow-md hover:from-teal-500 hover:to-green-400 transition duration-300 hover:scale-105">
                      Register
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* More Button */}
          {rows * 4 < events.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleMore}
                className="bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 px-8 rounded-lg text-lg shadow-lg hover:from-teal-500 hover:to-green-400 transition duration-300 hover:scale-105"
              >
                See More
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Events;
