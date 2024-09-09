const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    lastLogin: { type: Date },
    role: {
      type: String,
      enum: ["student", "organizer", "admin"],
      required: true,
    },
    phone: { type: String, required: true },
    photo: { type: String },
  },
  {
    timestamps: true,
    discriminatorKey: "role",
    collection: "users",
  }
);

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", UserSchema);

const AdminSchema = new Schema({});

const Admin = User.discriminator("admin", AdminSchema);

const StudentSchema = new Schema({
  registeredEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "Bookmark" }],
  requests: [{ type: Schema.Types.ObjectId, ref: "Request" }],
});

const Student = User.discriminator("student", StudentSchema);

const OrganizerSchema = new Schema({
  createdEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  requests: [{ type: Schema.Types.ObjectId, ref: "Request" }],
});

const Organizer = User.discriminator("organizer", OrganizerSchema);

module.exports = User;
