const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

exports.generatePayroll = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    const employees = await Employee.find({ status: 'active' });
    const generated = [];
    const skipped = [];

    for (let emp of employees) {
      const exists = await Payroll.findOne({ employeeId: emp._id, month, year });
      if (exists) {
        skipped.push(emp.employeeId);
        continue;
      }

      const basicSalary = emp.salary;
      const allowances = basicSalary * 0.2;
      const deductions = basicSalary * 0.1;
      const netSalary = basicSalary + allowances - deductions;

      const payroll = await Payroll.create({
        employeeId: emp._id,
        month,
        year,
        basicSalary,
        allowances,
        deductions,
        netSalary,
        status: 'pending'
      });
      
      generated.push(payroll);
    }

    res.json({ message: 'Payroll generation completed', generatedCount: generated.length, skippedCount: skipped.length, skipped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyPayroll = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const payrolls = await Payroll.find({ employeeId: employee._id }).sort({ year: -1, month: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPayroll = async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = {};
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const payrolls = await Payroll.find(query).populate('employeeId', 'name employeeId department designation').sort({ year: -1, month: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = { status };
    if (status === 'processed' || status === 'paid') {
      updateData.processedAt = new Date();
    }
    
    const payroll = await Payroll.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
