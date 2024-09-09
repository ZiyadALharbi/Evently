const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  eventTitle: { type: String, required: true },
  organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  organizerName: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  requestDate: { type: Date, default: Date.now },

  questions: [{ type: String }],
  answers: [{ type: String }],
});

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;