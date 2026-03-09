const express = require('express');
const profileController = require('../controllers/profileController');
const protect = require('../middlewares/protect');

const router = express.Router();

/**
 * PATH: /api/v1/profile
 * All routes require authentication.
 */

// GET  /api/v1/profile/birth-details  → return stored birth profile
router.get('/birth-details', protect, profileController.getBirthProfile);

// PATCH /api/v1/profile/birth-details → explicit manual override
router.patch('/birth-details', protect, profileController.updateBirthProfile);

module.exports = router;
