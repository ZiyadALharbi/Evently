const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
  },
  dateSubscribed: {
    type: Date,
    default: Date.now,
  },
});

const Email = mongoose.model('Email', EmailSchema);

module.exports = Email;
