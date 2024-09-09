const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  organizerName: { type: String, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  questions: [{ type: String, required: true }],
  eventImage: { type: String },
  duration: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  tags: [{ type: String }],
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
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
