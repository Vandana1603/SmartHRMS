const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, default: Date.now },
  checkIn: { type: String }, // HH:MM
  checkOut: { type: String }, // HH:MM
  status: { type: String, enum: ['present', 'absent', 'half-day', 'leave'], default: 'present' },
  hoursWorked: { type: Number, default: 0 },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
