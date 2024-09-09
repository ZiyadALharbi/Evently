const Event = require("../models/event_model");
var mongoose = require("mongoose");

const verifyOrganizer = async (req, res, next) => {
  const organizerId = req.user._id;
  const eventId = req.params.id;

  console.log("Type of eventId:", typeof eventId);

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    console.log(eventId);
    return res.status(400).json({ error: "Invalid event ID format" });
  }

  console.log("here 1");
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    console.log("here 2");

    console.log("Event found:", event);

    if (req.user.role !== "organizer") {
      return res
        .status(403)
        .json({ error: "Only organizers can delete events" });
    }

    console.log("here 3");

    if (event.organizerId.toString() !== organizerId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this event" });
    }
    console.log("here 4");

    req.event = event;
    console.log("here 5");
    next();
  } catch (error) {
    console.log("here 123");
    res.status(500).json({ error: error.message });
  }
};

module.exports = verifyOrganizer;
