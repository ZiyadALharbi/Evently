import React, { useState } from "react";
import axios from "axios";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    questions: [],
    startTime: "",
    endTime: "",
    tags: [],
    eventImage: null,
    eventType: "",
    notes: [],
  });

  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "eventImage") {
      setFormData({
        ...formData,
        eventImage: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = e.target.value;
    setFormData({
      ...formData,
      questions: newQuestions,
    });
  };

  const handleNotesChange = (index, e) => {
    const newNotes = [...formData.notes];
    newNotes[index] = e.target.value;
    setFormData({
      ...formData,
      notes: newNotes,
    });
  };

  const handleTagChange = (e) => {
    setTagInput(e.target.value);
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, ""],
    });
  };

  const addNote = () => {
    setFormData({
      ...formData,
      notes: [...formData.notes, ""],
    });
  };

  const addTag = () => {
    if (tagInput) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput],
      });
      setTagInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("date", formData.date);
      data.append("location", formData.location);
  

      formData.questions.forEach((question) => {
        data.append("questions", question);
      });
  
      data.append("duration[startTime]", formData.startTime);
      data.append("duration[endTime]", formData.endTime);
  

      formData.tags.forEach((tag) => {
        data.append("tags", tag);
      });
  
      data.append("eventType", formData.eventType);
  
      if (formData.eventImage) {
        data.append("eventImage", formData.eventImage);
      }
  

      formData.notes.forEach((note) => {
        data.append("notes", note);
      });
  
      const response = await axios.post(
        "http://localhost:6001/organizer/create-event",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        alert("Event created successfully!");
      }
    } catch (error) {
      console.error(
        "Error creating event:",
        error.response ? error.response.data : error.message
      );
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-400 to-teal-600">
      <div className="bg-white p-6 m-4 rounded-xl shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">
          Create New Event
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-md font-semibold text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-md font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500"
              placeholder="Enter event description"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-md font-semibold text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-md font-semibold text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500"
              placeholder="Enter event location"
              required
            />
          </div>

          {/* Duration */}
          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label className="block text-md font-semibold text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-md font-semibold text-gray-700">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Tags
            </label>
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-teal-100 text-teal-700 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
            <div className="flex mt-2">
              <input
                type="text"
                value={tagInput}
                onChange={handleTagChange}
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="ml-4 bg-gradient-to-r from-teal-500 to-green-400 text-white px-3 py-2 rounded-lg transition-transform transform hover:scale-105"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Event Image */}
          <div className="mb-4">
            <label className="block text-md font-semibold text-gray-700">
              Event Image
            </label>
            <input
              type="file"
              name="eventImage"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500"
              accept="image/*"
            />
          </div>

          {/* Event Type */}
          <div className="mb-4">
            <label className="block text-md font-semibold text-gray-700">
              Event Type
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select Event Type</option>
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Bootcamp">Bootcamp</option>
              <option value="Lecture">Lecture</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Cultural Event">Cultural Event</option>
              <option value="Volunteer">Volunteer</option>
            </select>
          </div>

          {/* Dynamic Questions */}
          <div className="mb-4">
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Questions
            </label>
            {formData.questions.map((question, index) => (
              <input
                key={index}
                type="text"
                value={question}
                onChange={(e) => handleQuestionChange(index, e)}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500"
                placeholder={`Question ${index + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="bg-gradient-to-r from-teal-500 to-green-400 text-white px-3 py-2 mt-3 rounded-lg w-full transition-transform transform hover:scale-105"
            >
              Add Question
            </button>
          </div>

          {/* Dynamic Notes */}
          <div className="mb-4">
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Notes
            </label>
            {formData.notes.map((note, index) => (
              <input
                key={index}
                type="text"
                value={note}
                onChange={(e) => handleNotesChange(index, e)}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500"
                placeholder={`Note ${index + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={addNote}
              className="bg-gradient-to-r from-teal-500 to-green-400 text-white px-3 py-2 mt-3 rounded-lg w-full transition-transform transform hover:scale-105"
            >
              Add Note
            </button>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-2 rounded-lg w-full transition-transform transform hover:scale-105 hover:from-yellow-500 hover:to-yellow-600"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

