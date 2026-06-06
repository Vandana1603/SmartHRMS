const express = require('express');
const router = express.Router();
const { generateQuestions, analyseInterview, getInterview } = require('../controllers/interviewController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);
router.use(authorizeRoles('admin', 'hr_recruiter', 'senior_manager'));

router.post('/generate-questions', generateQuestions);
router.post('/analyse', analyseInterview);
router.get('/:candidateId', getInterview);

module.exports = router;
