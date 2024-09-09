const Event = require("../models/event_model.js");
const User = require("../models/user_model.js");
const Request = require("../models/request_model.js");
const EventRequests = require("../models/create_event_request_model.js");
const OrganizerRequest = require("../models/organizer_request_model.js");
const bcrypt = require("bcryptjs");
const Email = require("../models/email_model.js");

const emails = async (req, res) => {
  try {
    const emails = await Email.find();
    res.status(200).json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const viewAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "firstname lastname username email role phone"
    );
    console.log(users);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

const getOrganizerRequests = async (req, res) => {
  try {
    const requests = await OrganizerRequest.find({ status: "pending" });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching organizer requests" });
  }
};

const manageOrganizerRequests = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log("org 1 ");
  try {
    const request = await OrganizerRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    console.log("org 1 ");

    if (status === "approved") {
      const hashedPassword = await bcrypt.hash("defaultpassword", 12);
      await User.create({
        email: request.email,
        password: hashedPassword,
        firstname: request.firstname,
        lastname: request.lastname,
        username: request.username,
        role: "organizer",
        phone: request.phone,
        photo: request.photo,
      });
    }
    console.log("org 1 ");

    request.status = status;
    await request.save();

    res
      .status(200)
      .json({ message: `Organizer request ${status} successfully`, request });
  } catch (error) {
    console.error("Error managing organizer request:", error);
    res.status(500).json({ error: "Error managing organizer request" });
  }
};

const getActivityLogs = async (req, res) => {
  try {
    const logs = await Event.find().select(
      "title date organizerId participants"
    );
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ error: "Error fetching activity logs" });
  }
};

const getActiveUsersMetrics = async (req, res) => {
  try {
    const dailyActive = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    const weeklyActive = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    const monthlyActive = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      daily: dailyActive,
      weekly: weeklyActive,
      monthly: monthlyActive,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching active users metrics" });
  }
};

const getUserGrowthTracking = async (req, res) => {
  try {
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    console.log(recentUsers);
    const now = new Date();

    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    console.log("Start of the week:", startOfWeek);
    console.log("Start of the month:", startOfMonth);

    const weeklyUsers = await User.countDocuments({
      createdAt: { $gte: startOfWeek },
    });

    const monthlyUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    console.log("Weekly Users:", weeklyUsers);
    console.log("Monthly Users:", monthlyUsers);

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      weekly: weeklyUsers,
      monthly: monthlyUsers,
      total: totalUsers,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user growth tracking" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).lean();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events for admin:", error);
    res.status(500).json({ message: "Server error fetching events." });
  }
};

const getEventRequests = async (req, res) => {
  try {
    const requests = await EventRequests.find({ approved: false }).populate(
      "eventDetails.organizerId",
      "username"
    );
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching event requests:", error);
    res.status(500).json({ message: "Error fetching event requests", error });
  }
};

const approveEventRequest = async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;

  try {
    const eventRequest = await EventRequests.findById(id);
    if (!eventRequest) {
      return res.status(404).json({ message: "Event request not found" });
    }

    if (approved) {
      const newEvent = new Event({
        title: eventRequest.eventDetails.title,
        description: eventRequest.eventDetails.description,
        date: eventRequest.eventDetails.date,
        location: eventRequest.eventDetails.location,
        organizerId: eventRequest.eventDetails.organizerId,
        organizerName: eventRequest.eventDetails.organizerName,
        questions: eventRequest.eventDetails.questions,
        duration: eventRequest.eventDetails.duration,
        tags: eventRequest.eventDetails.tags,
        eventImage: eventRequest.eventDetails.eventImage,
        eventType: eventRequest.eventDetails.eventType,
        notes: eventRequest.eventDetails.notes,
      });

      await newEvent.save();
      console.log("Event created in the Event schema");
    }

    eventRequest.approved = approved;
    await eventRequest.save();

    res
      .status(200)
      .json({ message: "Event approval status updated", eventRequest });
  } catch (error) {
    res.status(500).json({
      message: "Error updating approval status",
      error: error.message,
    });
  }
};

const getEventPerformanceInsights = async (req, res) => {
  try {
    const events = await Event.aggregate([
      {
        $lookup: {
          from: "requests",
          localField: "_id",
          foreignField: "eventId",
          as: "requests",
        },
      },
      {
        $project: {
          title: 1,
          participantsCount: { $size: "$participants" },
          requestsCount: { $size: "$requests" },
        },
      },
    ]);

    console.log(events);
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching event performance insights", error);
    res
      .status(500)
      .json({ error: "Error fetching event performance insights" });
  }
};

const getPopularEventsTracking = async (req, res) => {
  try {
    const popularEvents = await Request.aggregate([
      {
        $group: {
          _id: "$eventId",
          requestsCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      { $unwind: "$eventDetails" },
      {
        $project: {
          _id: 1,
          requestsCount: 1,
          "eventDetails.title": 1,
          "eventDetails.organizerName": 1,
          "eventDetails.participants": 1,
        },
      },
      { $sort: { requestsCount: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({ popularEvents });
  } catch (error) {
    res.status(500).json({ error: "Error fetching popular events" });
  }
};

const manageEventCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, action } = req.body;

    let result;
    if (action === "create") {
      result = await Event.create({ name });
    } else if (action === "edit") {
      result = await Event.findByIdAndUpdate(id, { name }, { new: true });
    } else if (action === "delete") {
      result = await Event.findByIdAndDelete(id);
    }

    res
      .status(200)
      .json({ message: `Category ${action}d successfully`, result });
  } catch (error) {
    res.status(500).json({ error: `Error ${action}ing category` });
  }
};

const getPlatformUsageStatistics = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const dailyActiveUsers = await User.countDocuments({
      lastLogin: { $gte: startOfDay },
    });
    const weeklyActiveUsers = await User.countDocuments({
      lastLogin: { $gte: startOfWeek },
    });
    const monthlyActiveUsers = await User.countDocuments({
      lastLogin: { $gte: startOfMonth },
    });

    const eventsCreated = await Event.countDocuments();
    const registrationsCompleted = await Request.countDocuments({
      status: "approved",
    });

    const statistics = {
      dailyActiveUsers,
      weeklyActiveUsers,
      monthlyActiveUsers,
      eventsCreated,
      registrationsCompleted,
    };

    res.status(200).json(statistics);
  } catch (error) {
    console.error("Error fetching platform usage statistics:", error);
    res.status(500).json({ error: "Error fetching platform usage statistics" });
  }
};

module.exports = {
  emails,
  viewAllUsers,
  getOrganizerRequests,
  manageOrganizerRequests,
  getActivityLogs,
  getActiveUsersMetrics,
  getUserGrowthTracking,
  getAllEvents,
  getEventRequests,
  approveEventRequest,
  getEventPerformanceInsights,
  getPopularEventsTracking,
  manageEventCategories,
  getPlatformUsageStatistics,
};
