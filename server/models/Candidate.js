const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  resumeFileName: { type: String },
  resumeText: { type: String },
  jobRole: { type: String },
  technicalScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  rating: { type: String, enum: ['Excellent', 'Good', 'Average', 'Poor'] },
  skillsMatched: [{ type: String }],
  skillsMissing: [{ type: String }],
  keyStrengths: [{ type: String }],
  yearsOfExperience: { type: Number },
  aiFeedback: { type: String },
  recommendation: { 
    type: String, 
    enum: ['Strongly Recommended', 'Recommended', 'Maybe', 'Not Recommended'] 
  },
  status: { type: String, enum: ['pending', 'shortlisted', 'rejected'], default: 'pending' },
  screenedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
