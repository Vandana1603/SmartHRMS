const Performance = require('../models/Performance');
const Employee = require('../models/Employee');

exports.createReview = async (req, res) => {
  try {
    const { employeeId, reviewPeriod, year, goals, ratings, reviewerComments } = req.body;
    
    // Calculate overall rating
    const values = Object.values(ratings);
    const overallRating = values.reduce((a, b) => a + b, 0) / values.length;

    const review = await Performance.create({
      employeeId,
      reviewPeriod,
      year,
      goals,
      ratings,
      overallRating,
      reviewerComments,
      reviewedBy: req.user.id
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const reviews = await Performance.find({ employeeId: employee._id }).sort({ year: -1, reviewPeriod: -1 }).populate('reviewedBy', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeReviews = async (req, res) => {
  try {
    const reviews = await Performance.find({ employeeId: req.params.id }).sort({ year: -1, reviewPeriod: -1 }).populate('reviewedBy', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeamSummary = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'senior_manager') {
      const employee = await Employee.findOne({ userId: req.user.id });
      const dept = employee ? employee.department : req.user.department;
      if (dept) {
        const team = await Employee.find({ department: dept }).select('_id');
        const ids = team.map(t => t._id);
        query.employeeId = { $in: ids };
      }
    }

    const reviews = await Performance.find(query).populate('employeeId', 'name designation department').sort({ year: -1, reviewPeriod: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
