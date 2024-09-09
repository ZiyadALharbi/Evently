const Event = require("../models/event_model.js");
const User = require("../models/user_model.js");
const Request = require("../models/request_model.js");
const Bookmark = require("../models/bookmark_model.js");
const Student = require("../models/user_model.js");
const { uploadImageToCloudStorage } = require("../util/uploadImage");

const ShowEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    res.status(200).json({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      organizer: event.organizer,
      questions: Array.from(event.questions.entries()),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const EventQuestions = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ questions: event.questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve questions" });
  }
};

const SendRequest = async (req, res) => {
  try {
    const studentId = req.user._id;
    const studentName = req.user.username;
    const { answers } = req.body;
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const newRequest = new Request({
      studentId,
      studentName,
      eventId,
      eventTitle: event.title,
      organizerId: event.organizerId,
      organizerName: event.organizerName,
      questions: event.questions,
      answers,
    });

    await newRequest.save();

    res.status(201).json({ message: "Request submitted successfully" });
  } catch (error) {
    console.error("Error submitting request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ student: req.user.id }).populate(
      "event"
    );
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const addToBookmark = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const studentId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existingBookmark = await Bookmark.findOne({
      student: studentId,
      event: eventId,
    });
    if (existingBookmark) {
      return res.status(400).json({ message: "Event already bookmarked" });
    }

    const newBookmark = new Bookmark({
      student: studentId,
      event: eventId,
    });
    await newBookmark.save();

    res.status(201).json({ message: "Event bookmarked successfully" });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the bookmark" });
  }
};

const removeFromBookmark = async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({
      student: req.user.id,
      event: req.params.eventId,
    });
    res.json({ message: "Event removed from bookmarks" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }

};

const profile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);
    if (user) {
      res.json({
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        photo: user.photo, 
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};




const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    

    if (req.file) {
      const imageUrl = await uploadImageToCloudStorage(req.file);
      user.photo = imageUrl; 
    }

    await user.save();
    res.status(200).json({
      message: "Profile picture updated successfully",
      imageUrl: user.photo,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({ studentId: req.user.id }).populate(
      "eventId",
      "title date location eventType eventImage duration"
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const cancelRequest = async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: "Request canceled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  ShowEvent,
  EventQuestions,
  SendRequest,
  addToBookmark,
  removeFromBookmark,
  profile,
  updateProfilePicture,
  cancelRequest,
  getBookmarks,
  getRequests,
};
