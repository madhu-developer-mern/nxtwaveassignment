const express = require('express');
const { register, login, verifyToken, changePassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/verify', authenticateToken, verifyToken);
router.post('/change-password', authenticateToken, changePassword);

module.exports = router;