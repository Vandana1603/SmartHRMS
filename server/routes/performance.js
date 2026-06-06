const express = require('express');
const router = express.Router();
const { createReview, getMyReviews, getEmployeeReviews, getTeamSummary } = require('../controllers/performanceController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'senior_manager'), createReview);
router.get('/my', getMyReviews);
router.get('/employee/:id', authorizeRoles('admin', 'senior_manager'), getEmployeeReviews);
router.get('/team', authorizeRoles('admin', 'senior_manager'), getTeamSummary);

module.exports = router;
