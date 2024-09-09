const jwt = require("jsonwebtoken");
const Event = require("../models/event_model.js");
const User = require("../models/user_model.js");
const Request = require("../models/request_model.js");
const EventRequest = require("../models/create_event_request_model.js");
const { uploadImageToCloudStorage } = require("../util/uploadImage.js");

const CreateEventRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      date,
      questions,
      duration,
      tags,
      eventType,
      notes,
    } = req.body;

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const organizerDoc = await User.findOne({
      _id: decodedToken.id,
      role: "organizer",
    }).select("_id username");

    if (!organizerDoc) {
      return res.status(404).json({ error: "Organizer not found" });
    }

    let eventImageUrl = null;

    if (req.file) {
      eventImageUrl = await uploadImageToCloudStorage(req.file);
    }

    const newRequest = new EventRequest({
      eventDetails: {
        title,
        description,
        date,
        location,
        organizerId: organizerDoc._id,
        organizerName: organizerDoc.username,
        questions,
        duration,
        tags,
        eventImage: eventImageUrl,
        eventType,
        notes,
      },
    });

    await newRequest.save();

    res.status(201).json({
      message: "Event creation request submitted",
      request: newRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const DeleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    console.log("here 1");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const EditEvent = async (req, res) => {
  const eventId = req.params.id;
  const {
    title,
    description,
    location,
    date,
    questions,
    duration,
    tags,
    notes,
  } = req.body;
  const eventImage = req.file;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this event" });
    }


    if (eventImage) {
      if (event.eventImage) {
        await deleteImageFromCloudStorage(event.eventImage); 
      }
      const uploadedImageUrl = await uploadImageToCloudStorage(eventImage); 
      event.eventImage = uploadedImageUrl;
    }

    let parsedDuration =
      typeof duration === "string" ? JSON.parse(duration) : duration;

    event.title = title;
    event.description = description;
    event.location = location;
    event.date = date;
    event.questions = Array.isArray(questions)
      ? questions
      : JSON.parse(questions || "[]");
    event.organizerName = req.user.username;
    event.duration = parsedDuration;
    event.tags = Array.isArray(tags) ? tags : JSON.parse(tags || "[]");
    event.notes = Array.isArray(notes) ? notes : JSON.parse(notes || "[]");

    await event.save();
    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;


    const user = await User.findById(userId).select(
      "firstname lastname username email role phone photo"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const events = await Event.find({ organizerId: userId }).select(
      "title location date"
    );

    console.log(user);

    res.status(200).json({
      userInfo: {
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        photo: user.photo,
      },
      events,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

const getEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate(
      "organizerId",
      "username"
    );

    if (!event) {
      return res.status(404).send("Event not found");
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getRequestsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log("here 1 Requests");

    const requests = await Request.find({ eventId });
    console.log("here 2");

    if (!requests) {
      return res
        .status(404)
        .json({ message: "No requests found for this event." });
    }
    console.log("here 3");

    const pendingRequests = requests.filter(
      (request) => request.status === "pending"
    );
    const approvedRequests = requests.filter(
      (request) => request.status === "approved"
    );
    const rejectedRequests = requests.filter(
      (request) => request.status === "rejected"
    );
    console.log("here 4");

    res.status(200).json({
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    });
    console.log("here 5");
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    console.log("here 1 update");

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );
    console.log("here 2");

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found." });
    }
    console.log("here 3");

    if (status === "approved") {
      await Event.findByIdAndUpdate(updatedRequest.eventId, {
        $addToSet: { participants: updatedRequest.studentId },
      });
    }
    console.log("here 4");

    res.status(200).json({
      message: "Request status updated successfully.",
      updatedRequest,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreateEventRequest,
  DeleteEvent,
  EditEvent,
  getProfile,
  updateProfilePicture,
  getEvent,
  getRequestsByEvent,
  updateRequestStatus,
};
