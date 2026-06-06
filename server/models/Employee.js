const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { 
    type: String, 
    enum: ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations'],
    required: true 
  },
  designation: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  salary: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  address: { type: String },
  emergencyContact: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
