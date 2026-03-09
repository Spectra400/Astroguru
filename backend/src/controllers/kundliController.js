const kundliService = require('../services/kundliService');

/**
 * KUNDLI CONTROLLER
 * Handles HTTP requests for astrology chart generation.
 */

/**
 * Generate a Kundli chart
 * POST /api/v1/kundli
 */
exports.getKundli = async (req, res, next) => {
    try {
        const { date, time, place } = req.body;

        // 1. Basic validation
        if (!date || !time || !place) {
            const error = new Error('Please provide birth date, time, and place.');
            error.statusCode = 400;
            error.status = 'fail';
            return next(error);
        }

        // 2. Delegate to Service Layer
        const kundli = await kundliService.getKundli({ date, time, place }, req.user._id);

        // 3. Send structured response
        res.status(200).json({
            status: 'success',
            data: {
                kundli
            }
        });
    } catch (err) {
        // Automatically handled by centralized error middleware
        next(err);
    }
};
