const mongoose = require('mongoose');

const onboardingTaskSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  week: { type: Number, required: true },
  title: { type: String, required: true },
  tasks: [{ type: String }],
  resources: [{ type: String }],
  milestone: { type: String }
});

const progressSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
});

const onboardingSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  plan: [onboardingTaskSchema],
  progress: [progressSchema],
  overallProgress: { type: Number, default: 0 },
  status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' },
  startDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Onboarding', onboardingSchema);
