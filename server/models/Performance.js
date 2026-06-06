const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  reviewPeriod: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4'], required: true },
  year: { type: Number, required: true },
  goals: [{ goal: String, achieved: Boolean }],
  ratings: {
    technical: { type: Number, default: 0, min: 1, max: 5 },
    teamwork: { type: Number, default: 0, min: 1, max: 5 },
    communication: { type: Number, default: 0, min: 1, max: 5 },
    leadership: { type: Number, default: 0, min: 1, max: 5 },
    delivery: { type: Number, default: 0, min: 1, max: 5 }
  },
  overallRating: { type: Number, default: 0 },
  reviewerComments: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);
