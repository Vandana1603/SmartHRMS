const express = require('express');
const router = express.Router();
const { getEmployees, getEmployeeProfile, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', authorizeRoles('admin', 'senior_manager', 'hr_recruiter'), getEmployees);
router.get('/me', getEmployeeProfile);
router.get('/:id', authorizeRoles('admin', 'senior_manager', 'hr_recruiter'), getEmployeeById);
router.post('/', authorizeRoles('admin'), createEmployee);
router.put('/:id', authorizeRoles('admin'), updateEmployee);
router.delete('/:id', authorizeRoles('admin'), deleteEmployee);

module.exports = router;
