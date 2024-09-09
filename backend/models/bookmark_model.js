const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookmarkSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Bookmark = mongoose.model("Bookmark", BookmarkSchema);

module.exports = Bookmark;