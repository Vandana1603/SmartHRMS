const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/analyticsController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.get('/dashboard', authorizeRoles('admin'), getDashboard);

module.exports = router;
