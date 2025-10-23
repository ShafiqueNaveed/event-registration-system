const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  registeredEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'  // Links to registrations
  }]
}, {
  timestamps: true  // Adds createdAt and updatedAt
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);