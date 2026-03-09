const express = require('express');
const kundliController = require('../controllers/kundliController');
const protect = require('../middlewares/protect');

const router = express.Router();

/**
 * PATH: /api/v1/kundli
 */

// Generate Kundli (Protected - requires valid JWT)
router.post('/', protect, kundliController.getKundli);

module.exports = router;
