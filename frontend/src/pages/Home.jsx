import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineLightBulb,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineDesktopComputer,
  HiOutlinePresentationChartBar,
  HiOutlineUserGroup,
  HiOutlineClipboardCheck,
  HiOutlineLibrary,
} from "react-icons/hi";
import DefaultPic from "/Users/ziyadalharbi/EVENT/frontend/src/assets/wallhaven-3lepy9.jpg";
import Footer from "../components/Footer.jsx";

function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    // axios
    //   .get("https://evently-0e9w.onrender.com/general/home-events")
    //   .then((response) => setFeaturedEvents(response.data.events))
    //   .catch((error) => console.error("Error fetching events:", error));

    // axios
    //   .get("https://evently-0e9w.onrender.com/general/home-events")
    //   .then((response) => setFeaturedEvents(response.data.events))
    //   .catch((error) => console.error("Error fetching events:", error));
    axios.get("https://evently-0e9w.onrender.com/general/home-events")
    .then((response) => {
      console.log("Events fetched:", response.data);
      setFeaturedEvents(response.data.events);
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
      setFeaturedEvents([]);  // Fallback value
    });
  }, []);

  const handleEmailSubscription = async () => {
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    try {
      const response = await axios.post(
        "https://evently-0e9w.onrender.com/general/subscribe",
        {
          email,
        }
      );
      setMessage("Subscription successful! Thank you for joining.");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      setMessage("Subscription failed. Please try again.");
    }
  };

  const handleRegister = () => {
    if (isLoggedIn) {
      alert("You are already registered and logged in!");
    } else {
      navigate("/signup");
    }
  };

  const categories = [
    {
      name: "Conference",
      icon: HiOutlineLightBulb,
      description:
        "Conferences are large gatherings where experts share their knowledge and insights on specific topics. They offer networking opportunities and the latest industry updates.",
    },
    {
      name: "Workshop",
      icon: HiOutlineBriefcase,
      description:
        "Workshops are interactive sessions where participants engage in practical activities and discussions to develop new skills or improve existing ones.",
    },
    {
      name: "Seminar",
      icon: HiOutlineAcademicCap,
      description:
        "Seminars are educational events focusing on a specific subject, typically featuring one or more experts who share their knowledge with attendees.",
    },
    {
      name: "Bootcamp",
      icon: HiOutlineDesktopComputer,
      description:
        "Bootcamps are intensive, short-term training programs designed to build skills in a specific area, often related to technology or business.",
    },
    {
      name: "Lecture",
      icon: HiOutlinePresentationChartBar,
      description:
        "Lectures are educational talks delivered by an expert, often in an academic setting, focusing on a particular subject or topic.",
    },
    {
      name: "Hackathon",
      icon: HiOutlineUserGroup,
      description:
        "Hackathons are competitive events where teams work together to develop a project, often within a short time frame, with a focus on coding and innovation.",
    },
    {
      name: "Cultural Event",
      icon: HiOutlineClipboardCheck,
      description:
        "Cultural events celebrate the arts, traditions, and practices of different communities, often featuring performances, exhibitions, and activities.",
    },
    {
      name: "Volunteer",
      icon: HiOutlineLibrary,
      description:
        "Volunteer events provide opportunities for individuals to contribute their time and skills to support a cause or help the community.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${DefaultPic})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            Discover, Learn, and Grow
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mt-4 drop-shadow-md">
            Join our exciting university events
          </p>
          <div className="mt-8 space-x-4">
            <Link
              to="/events"
              className="bg-gradient-to-r from-teal-400 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-teal-500 hover:to-teal-700 transition-transform duration-300 transform hover:scale-105"
            >
              View Events
            </Link>
            <button
              onClick={handleRegister}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-transform duration-300 transform hover:scale-105"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>

      {/* Explore Categories */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                to={`/events?category=${category.name}`}
                key={category.name}
                className="group bg-white hover:bg-teal-500 text-teal-600 hover:text-white rounded-lg shadow-lg p-8 flex flex-col items-center transition-all duration-300 transform hover:scale-105"
              >
                <category.icon className="h-12 w-12 mb-4 text-teal-500 group-hover:text-white transition-colors duration-300" />
                <span className="font-semibold text-lg">{category.name}</span>
                <p className="group-hover:opacity-100 mt-4 text-sm text-teal-700 group-hover:text-white transition-opacity duration-300 text-center">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Featured Events */}
      <h2 className="text-3xl font-bold text-center mt-8 text-gray-800">
        Featured Events
      </h2>
      <div className="container mx-auto py-12 overflow-x-auto overflow-visible">
        <div className="">
          <div className="flex space-x-8 px-4">
            {featuredEvents.map((event) => {
              const eventImage = event.eventImage || DefaultPic;
              const startTime = event.duration?.startTime || "8:00pm";
              const endTime = event.duration?.endTime || "10:30pm";
              return (
                <Link
                  key={event._id}
                  to={`/EventPage/${event._id}`}
                  className="min-w-[320px] max-w-[350px] bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-transform duration-500 hover:scale-105 hover:z-10"
                >
                  {/* Event Image */}
                  <div className="relative h-60">
                    <img
                      src={eventImage}
                      alt={event.title}
                      className="rounded-t-lg w-full h-full object-cover"
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
                    <button className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold py-2 rounded-lg shadow-md hover:from-teal-500 hover:to-green-400 transition-transform duration-300 hover:scale-105">
                      Register
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="bg-gradient-to-r from-teal-500 to-green-500 py-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Be the First to Know!</h2>
        <p className="text-lg mb-6">
          Join our community and never miss an event.
        </p>
        <div className="flex justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-l-lg py-3 px-4 w-1/2 text-gray-800"
            placeholder="Enter your email"
          />
          <button
            onClick={handleEmailSubscription}
            className="bg-yellow-400 text-white py-3 px-6 rounded-r-lg font-semibold hover:bg-yellow-500 transition duration-300"
          >
            Join Now
          </button>
        </div>
        {message && <p className="mt-4 text-lg">{message}</p>}{" "}
        {/* Display feedback message */}
      </div>

      <Footer />
    </>
  );
}

export default Home;
