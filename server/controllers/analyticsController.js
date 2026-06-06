const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Payroll = require('../models/Payroll');
const Candidate = require('../models/Candidate');
const Onboarding = require('../models/Onboarding');

exports.getDashboard = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'active' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const presentToday = await Attendance.countDocuments({ date: { $gte: today }, status: 'present' });
    
    const pendingPayroll = await Payroll.countDocuments({ status: 'pending' });
    const candidatesScreened = await Candidate.countDocuments();
    const onboardingActive = await Onboarding.countDocuments({ status: 'in-progress' });

    const deptAgg = await Employee.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);
    const departmentWiseCount = deptAgg.map(d => ({ dept: d._id, count: d.count }));

    const attendanceLast7Days = [];
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      const nextDate = new Date(d);
      nextDate.setDate(d.getDate() + 1);

      const pres = await Attendance.countDocuments({ date: { $gte: d, $lt: nextDate }, status: 'present' });
      const abs = await Attendance.countDocuments({ date: { $gte: d, $lt: nextDate }, status: 'absent' });
      
      attendanceLast7Days.push({ 
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
        present: pres, 
        absent: abs 
      });
    }

    const monthlyHires = [];
    for(let i=5; i>=0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      d.setDate(1); d.setHours(0,0,0,0);
      const nextMonth = new Date(d);
      nextMonth.setMonth(d.getMonth() + 1);

      const count = await Employee.countDocuments({ dateOfJoining: { $gte: d, $lt: nextMonth } });
      monthlyHires.push({
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        count
      });
    }

    res.json({
      totalEmployees,
      activeEmployees,
      presentToday,
      pendingPayroll,
      candidatesScreened,
      onboardingActive,
      departmentWiseCount,
      attendanceLast7Days,
      monthlyHires
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
