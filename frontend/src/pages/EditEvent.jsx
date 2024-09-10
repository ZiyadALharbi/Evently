import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditEventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    questions: [],
    eventImage: "",
    duration: { startTime: "", endTime: "" },
    tags: [],
    eventType: "",
    notes: [],
  });
  const [newQuestion, setNewQuestion] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newNote, setNewNote] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [oldImage, setOldImage] = useState(""); // Store the old image URL
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(
          `https://evently-0e9w.onrender.com/organizer/event/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const eventData = response.data;
        setEvent({
          title: eventData.title || "",
          description: eventData.description || "",
          location: eventData.location || "",
          date: eventData.date ? eventData.date.split("T")[0] : "",
          questions: eventData.questions || [],
          eventImage: eventData.eventImage || "",
          duration: eventData.duration || { startTime: "", endTime: "" },
          tags: eventData.tags || [],
          eventType: eventData.eventType || "",
          notes: eventData.notes || [],
        });
        setOldImage(eventData.eventImage);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [eventId, token]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedImageFile(e.target.files[0]);
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...event.questions];
    updatedQuestions[index] = e.target.value;
    setEvent({ ...event, questions: updatedQuestions });
  };

  const handleNoteChange = (index, e) => {
    const updatedNotes = [...event.notes];
    updatedNotes[index] = e.target.value;
    setEvent({ ...event, notes: updatedNotes });
  };

  const handleAddQuestion = () => {
    if (newQuestion) {
      setEvent({ ...event, questions: [...event.questions, newQuestion] });
      setNewQuestion("");
    }
  };

  const handleAddNote = () => {
    if (newNote) {
      setEvent({ ...event, notes: [...event.notes, newNote] });
      setNewNote("");
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...event.tags];
    updatedTags.splice(index, 1);
    setEvent({ ...event, tags: updatedTags });
  };

  const handleAddTag = () => {
    if (newTag) {
      setEvent({ ...event, tags: [...event.tags, newTag] });
      setNewTag("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", event.title);
    formData.append("description", event.description);
    formData.append("location", event.location);
    formData.append("date", event.date);
    formData.append("questions", JSON.stringify(event.questions));
    formData.append("duration", JSON.stringify(event.duration));
    formData.append("tags", JSON.stringify(event.tags));
    formData.append("eventType", event.eventType);
    formData.append("notes", JSON.stringify(event.notes));

    if (selectedImageFile) {
      formData.append("eventImage", selectedImageFile);
    }

    try {
      await axios.put(
        `https://evently-0e9w.onrender.com/organizer/edit-event/${eventId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (selectedImageFile && oldImage) {
        await axios.delete(`https://evently-0e9w.onrender.com/organizer/delete-image`, {
          data: { imageUrl: oldImage },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      navigate("/organizer-profile");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-400 to-teal-600">
      <div className="bg-white p-6 m-4 rounded-xl shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">
          Edit Event
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
              value={event.title}
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
              value={event.description}
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
              value={event.date}
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
              value={event.location}
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
                value={event.duration.startTime}
                onChange={(e) =>
                  setEvent({
                    ...event,
                    duration: { ...event.duration, startTime: e.target.value },
                  })
                }
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
                value={event.duration.endTime}
                onChange={(e) =>
                  setEvent({
                    ...event,
                    duration: { ...event.duration, endTime: e.target.value },
                  })
                }
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
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-teal-100 text-teal-700 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </span>
            ))}
            <div className="flex mt-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter a tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
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
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500"
              accept="image/*"
            />
            {event.eventImage && (
              <div className="mt-2">
                <img
                  src={event.eventImage}
                  alt="Event"
                  className="h-40 w-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Event Type */}
          <div className="mb-4">
            <label className="block text-md font-semibold text-gray-700">
              Event Type
            </label>
            <select
              name="eventType"
              value={event.eventType}
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
            {event.questions.map((question, index) => (
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
              onClick={handleAddQuestion}
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
            {event.notes.map((note, index) => (
              <input
                key={index}
                type="text"
                value={note}
                onChange={(e) => handleNoteChange(index, e)}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500"
                placeholder={`Note ${index + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={handleAddNote}
              className="bg-gradient-to-r from-teal-500 to-green-400 text-white px-3 py-2 mt-3 rounded-lg w-full transition-transform transform hover:scale-105"
            >
              Add Note
            </button>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-2 rounded-lg w-full transition-transform transform hover:scale-105 hover:from-yellow-500 hover:to-yellow-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
