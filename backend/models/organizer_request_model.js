const mongoose = require("mongoose");

const OrganizerRequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  photo: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OrganizerRequest", OrganizerRequestSchema);
