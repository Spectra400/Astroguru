const express = require('express');
const authController = require('../controllers/authController');
const protect = require('../middlewares/protect');

const router = express.Router();

/**
 * Public Routes
 */
router.post('/register', authController.register);
router.post('/login', authController.login);

/**
 * Protected Routes
 */
router.get('/me', protect, authController.getMe);

module.exports = router;
