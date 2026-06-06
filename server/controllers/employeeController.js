const Employee = require('../models/Employee');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/email');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('userId', 'email role');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('userId', 'name email role');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, designation, dateOfJoining, salary, address, emergencyContact, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    const userPassword = password || 'Employee@123';
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userPassword, salt); 
      
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'employee',
        department
      });
    }

    const count = await Employee.countDocuments();
    const employeeId = `EMP${(count + 1).toString().padStart(3, '0')}`;

    const employee = await Employee.create({
      employeeId,
      userId: user._id,
      name,
      email,
      phone,
      department,
      designation,
      dateOfJoining,
      salary,
      address,
      emergencyContact
    });

    // Send Welcome Email
    sendEmail({
      to: email,
      subject: 'Welcome to SmartHR System',
      text: `Hi ${name},\n\nWelcome to our company! Your employee profile has been created.\nYour login password is: ${userPassword}\n\nPlease log in and change your password.\n\nBest,\nHR Team`
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Sync with User document
    const user = await User.findById(employee.userId);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.department = req.body.department || user.department;
      
      if (req.body.password && req.body.password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      await user.save();
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    
    // Also delete associated User
    await User.findByIdAndDelete(employee.userId);

    res.json({ message: 'Employee and user account deleted successfully', employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
