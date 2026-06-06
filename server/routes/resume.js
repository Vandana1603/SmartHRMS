const express = require('express');
const router = express.Router();
const multer = require('multer');
const { screenBulk, getCandidates, updateStatus } = require('../controllers/resumeController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const upload = multer();

router.use(verifyToken);

router.post('/screen-bulk', authorizeRoles('admin', 'hr_recruiter'), upload.array('resumes', 10), screenBulk);
router.get('/candidates', authorizeRoles('admin', 'hr_recruiter', 'senior_manager'), getCandidates);
router.put('/candidates/:id/status', authorizeRoles('admin', 'hr_recruiter'), updateStatus);

module.exports = router;
