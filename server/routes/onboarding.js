const express = require('express');
const router = express.Router();
const { generatePlan, completeTask, getEmployeeOnboarding, getAllOnboarding } = require('../controllers/onboardingController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.post('/generate', authorizeRoles('admin', 'hr_recruiter'), generatePlan);
router.put('/:id/task/:taskId/complete', completeTask);
router.get('/employee/:employeeId', getEmployeeOnboarding);
router.get('/all', authorizeRoles('admin', 'hr_recruiter', 'senior_manager'), getAllOnboarding);

module.exports = router;
