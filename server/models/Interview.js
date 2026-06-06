const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  transcript: { type: String, required: true },
  jobRole: { type: String, required: true },
  generatedQuestions: [{ type: String }],
  clarityScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 0 },
  relevanceScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  detailedFeedback: { type: String },
  verdict: { type: String, enum: ['Strong Hire', 'Hire', 'Maybe', 'No Hire'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema);
