const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventRequestSchema = new Schema({
  eventDetails: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizerName: { type: String, required: true },
    questions: [{ type: String }],
    duration: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    tags: [{ type: String }],
    eventImage: { type: String },
    eventType: {
      type: String,
      enum: [
        "Conference",
        "Workshop",
        "Seminar",
        "Bootcamp",
        "Lecture",
        "Hackathon",
        "Cultural Event",
        "Volunteer",
      ],
      required: true,
    },
    notes: [{ type: String }],
  },
  approved: { type: Boolean, default: false },
  requestDate: { type: Date, default: Date.now },
});

const EventRequest = mongoose.model("EventRequest", EventRequestSchema);
module.exports = EventRequest;


