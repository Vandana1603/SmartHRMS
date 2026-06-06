const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

exports.checkIn = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) return res.status(404).json({ message: 'Employee record not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: today }
    });

    if (attendance && attendance.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    if (!attendance) {
      attendance = new Attendance({ employeeId: employee._id });
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    attendance.checkIn = timeStr;
    attendance.status = 'present';
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) return res.status(404).json({ message: 'Employee record not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: today }
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ message: 'Have not checked in today' });
    }
    
    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    attendance.checkOut = timeStr;

    // Calculate hours
    const [inH, inM] = attendance.checkIn.split(':').map(Number);
    const [outH, outM] = timeStr.split(':').map(Number);
    
    let diff = (outH + outM / 60) - (inH + inM / 60);
    attendance.hoursWorked = parseFloat(diff.toFixed(2));

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    let query = { employeeId: employee._id };
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await Attendance.find(query).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    let matchQuery = {};
    if (startDate && endDate) {
      matchQuery.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    let records = await Attendance.find(matchQuery).populate('employeeId', 'name employeeId department').sort({ date: -1 });

    if (department) {
      records = records.filter(r => r.employeeId && r.employeeId.department === department);
    }
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!attendance) return res.status(404).json({ message: 'Record not found' });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
