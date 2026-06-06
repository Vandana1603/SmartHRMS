const express = require('express');
const router = express.Router();
const { generatePayroll, getMyPayroll, getAllPayroll, updateStatus } = require('../controllers/payrollController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.post('/generate', authorizeRoles('admin'), generatePayroll);
router.get('/my', getMyPayroll);
router.get('/all', authorizeRoles('admin'), getAllPayroll);
router.put('/:id/status', authorizeRoles('admin'), updateStatus);

module.exports = router;
