import React, { useState } from "react";
import axios from "axios";
import {
  HiUserCircle,
  HiMail,
  HiLockClosed,
  HiPhone,
  HiUser,
} from "react-icons/hi";

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    username: "",
    role: "student",
    phone: "",
    photo: null,
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({
        ...formData,
        photo: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:6001/auth/signup",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (formData.role === "student") {
        setMessage({
          text: "Sign-up successful!",
          type: "success",
        });
      } else {
        setMessage({
          text: "Organizer request sent successfully!",
          type: "success",
        });
      }
    } catch (error) {
      const errorMessage =
        formData.role === "student"
          ? "Sign-up failed!"
          : "Organizer request failed!";
      setMessage({
        text: errorMessage,
        type: "error",
      });
    }
  };

  const messageStyles = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 to-teal-600 px-4">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-teal-600">
          Create Your Account
        </h2>
        {message.text && (
          <div className={`p-4 mb-6 rounded-lg ${messageStyles[message.type]}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-5 relative">
            <HiUser className="absolute left-3 top-3 text-teal-500 h-5 w-5" />
            <input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
          <div className="mb-5 relative">
            <HiUserCircle className="absolute left-3 top-3 text-teal-500 h-5 w-5" />
            <input
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
          <div className="mb-5 relative">
            <HiMail className="absolute left-3 top-3 text-teal-500 h-5 w-5" />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
          <div className="mb-5 relative">
            <HiUserCircle className="absolute left-3 top-3 text-teal-500 h-5 w-5" />
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
          <div className="mb-5 relative">
            <HiPhone className="absolute left-3 top-3 text-teal-500 h-5 w-5" />
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
          <div className="mb-5 relative">
            <HiLockClosed className="absolute left-3 top-3 text-teal-500 h-5 w-5" />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
          <div className="mb-5 relative">
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Profile Photo
            </label>
            <input
              type="file"
              name="photo"
              id="photo"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600"
            />
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            >
              <option value="student">Student</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
