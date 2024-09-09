const Event = require("../models/event_model.js");
const Email = require("../models/email_model.js");

const HomeEvents = async (req, res) => {
  try {
    const popularEvents = await Event.find()
      .sort({ participants: -1 })
      .limit(8);

    res.status(200).json({ success: true, events: popularEvents });
  } catch (error) {
    console.error("Error fetching popular events:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};

const getEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId)
      .populate("organizerId", "username photo")
      .lean();
    console.log("event page 111");
    if (!event) {
      return res.status(404).send("Event not found");
    }
    console.log("event page 211");

    if (event.eventImage) {
      event.eventImage = event.eventImage;
    }
    console.log("event page 311");

    res.status(200).json(event);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const newEmail = new Email({ email });
    await newEmail.save();
    res.status(200).json({ message: "Email subscribed successfully" });
  } catch (error) {
    console.error("Error subscribing email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getFilteredSortedEvents = async (req, res) => {
  try {
    const { filter, sortBy } = req.query;

    console.log("Incoming filter value:", filter);

    const filterQuery = filter && filter !== "All" ? { eventType: filter } : {};

    console.log("Constructed filterQuery:", filterQuery);

    let sortQuery = {};
    if (sortBy === "popularity") {
      sortQuery = { participants: -1 };
    } else if (sortBy === "recent") {
      sortQuery = { date: -1 };
    } else if (sortBy === "old") {
      sortQuery = { date: 1 };
    }

    console.log("Sort Query:", sortQuery);

    const events = await Event.find(filterQuery).sort(sortQuery).lean();

    console.log("Fetched events:", events.length);

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events", error });
  }
};

module.exports = { HomeEvents, getEvent, getFilteredSortedEvents, subscribe };
