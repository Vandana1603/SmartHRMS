const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Employee = require('./models/Employee');
const connectDB = require('./config/db');

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    const users = [
      {
        name: 'Admin User',
        email: 'admin@hrms.com',
        password: 'Admin@123',
        role: 'admin',
        department: 'Management'
      },
      {
        name: 'Senior Manager',
        email: 'manager@hrms.com',
        password: 'Manager@123',
        role: 'senior_manager',
        department: 'Engineering'
      },
      {
        name: 'HR Recruiter',
        email: 'hr@hrms.com',
        password: 'Hr@123',
        role: 'hr_recruiter',
        department: 'HR'
      },
      {
        name: 'Employee User',
        email: 'employee@hrms.com',
        password: 'Employee@123',
        role: 'employee',
        department: 'Engineering'
      }
    ];

    for (let u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        await User.create({
          ...u,
          password: hashedPassword
        });
        console.log(`User created: ${u.email}`);
      } else {
        console.log(`User already exists: ${u.email}`);
      }
    }

    const employeeData = [
      {
        email: 'manager@hrms.com',
        employeeId: 'DEMO001',
        phone: '1234567890',
        department: 'Engineering',
        designation: 'Engineering Manager',
        dateOfJoining: new Date('2024-01-01'),
        salary: 120000
      },
      {
        email: 'hr@hrms.com',
        employeeId: 'DEMO002',
        phone: '1234567891',
        department: 'HR',
        designation: 'HR Recruiter',
        dateOfJoining: new Date('2024-01-01'),
        salary: 80000
      },
      {
        email: 'employee@hrms.com',
        employeeId: 'DEMO003',
        phone: '1234567892',
        department: 'Engineering',
        designation: 'Software Engineer',
        dateOfJoining: new Date('2024-01-01'),
        salary: 70000
      },
      {
        email: 'admin@hrms.com',
        employeeId: 'DEMO000',
        phone: '1234567899',
        department: 'Engineering',
        designation: 'System Administrator',
        dateOfJoining: new Date('2024-01-01'),
        salary: 150000
      }
    ];

    for (let emp of employeeData) {
      const user = await User.findOne({ email: emp.email });
      if (user) {
        const exists = await Employee.findOne({ email: emp.email });
        if (!exists) {
          await Employee.create({
            ...emp,
            name: user.name,
            userId: user._id,
            status: 'active'
          });
          console.log(`Employee profile created for: ${emp.email}`);
        } else {
          console.log(`Employee profile already exists for: ${emp.email}`);
        }
      }
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedUsers();
