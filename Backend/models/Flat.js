const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a flat name'],
    trim: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inviteCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  rentAmount: {
    type: Number,
    default: 0
  },
  rentDueDay: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Flat', flatSchema);
