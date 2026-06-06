const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Public Routes
router.post('/ask-policy', chatbotController.askPolicy);
router.get('/policies', chatbotController.getAllPolicies);

// Admin Only Routes
router.post('/policies', verifyToken, authorizeRoles('admin'), chatbotController.createPolicy);
router.put('/policies/:id', verifyToken, authorizeRoles('admin'), chatbotController.updatePolicy);
router.delete('/policies/:id', verifyToken, authorizeRoles('admin'), chatbotController.deletePolicy);

module.exports = router;
