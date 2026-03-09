const mahadashaService = require('../services/mahadashaService');

/**
 * MAHADASHA CONTROLLER
 * No longer accepts birth details from request body.
 * Birth profile is read from the authenticated user's DB record.
 */

/**
 * POST /api/v1/mahadasha
 * Generates a Mahadasha report using stored birth profile.
 */
exports.getMahadasha = async (req, res, next) => {
    try {
        // Delegate to service — userId only, no body input needed
        const mahadasha = await mahadashaService.getMahadasha(req.user._id);

        res.status(200).json({
            status: 'success',
            data: { mahadasha }
        });
    } catch (err) {
        next(err);
    }
};
