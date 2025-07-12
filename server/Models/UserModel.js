const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },

  photo: {
    data: String,         // base64 string
    contentType: String   // e.g., "image/png"
  },

  location: {
    type: String,
    default: ''
  },

  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },

  skillsOffered: {
    type: [String],
    default: []
  },

  skillsWanted: {
    type: [String],
    default: []
  },

  availability: {
    type: String,     // e.g., 'weekends', 'evenings', 'full-time'
    default: ''
  },

  profileVisibility: {
    type: String,
    enum: ['Public', 'Private'],
    default: 'Public'
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
