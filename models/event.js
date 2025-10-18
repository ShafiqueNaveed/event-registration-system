const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'  // Links to registrations
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Optional: Link to organizer user
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);