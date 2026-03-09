const express = require('express');
const mahadashaController = require('../controllers/mahadashaController');
const protect = require('../middlewares/protect');

const router = express.Router();

/**
 * MAHADASHA ROUTES
 * Protected routes for generating Vimshottari Dasha reports.
 */

router.post('/', protect, mahadashaController.getMahadasha);

module.exports = router;
