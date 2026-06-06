const mongoose = require('mongoose');

const HRPolicySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['leave', 'benefits', 'conduct', 'work-hours', 'health', 'other'],
    default: 'other'
  },
  keywords: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HRPolicy', HRPolicySchema);
