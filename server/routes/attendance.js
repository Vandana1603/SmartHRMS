const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getMyAttendance, getReport, updateAttendance } = require('../controllers/attendanceController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/my', getMyAttendance);
router.get('/report', authorizeRoles('admin', 'senior_manager'), getReport);
router.put('/:id', authorizeRoles('admin'), updateAttendance);

module.exports = router;
