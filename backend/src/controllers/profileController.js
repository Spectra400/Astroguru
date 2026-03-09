const geocodingService = require('../integrations/geocodingService');
const User = require('../models/User');

/**
 * PROFILE CONTROLLER
 * Handles reading and explicit updating of a user's stored birth profile.
 */

/**
 * GET /api/v1/profile/birth-details
 * Returns the currently stored birth profile for the authenticated user.
 */
exports.getBirthProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('birthProfile');
        const profile = user?.birthProfile ?? null;

        res.status(200).json({
            status: 'success',
            data: { birthProfile: profile }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/v1/profile/birth-details
 * Explicit manual override of the stored birth profile.
 * Re-geocodes the place to get fresh coordinates.
 */
exports.updateBirthProfile = async (req, res, next) => {
    try {
        const { date, time, place } = req.body;

        if (!date || !time || !place) {
            const err = new Error('date, time, and place are required');
            err.statusCode = 400;
            return next(err);
        }

        // Re-geocode to get fresh, validated coordinates
        const { latitude, longitude, timezone, displayName } =
            await geocodingService.geocodePlace(place);

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    birthProfile: {
                        date,
                        time,
                        place: displayName,
                        latitude,
                        longitude,
                        timezone,
                        ayanamsa: 1,
                    }
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'Birth profile updated successfully',
            data: {
                birthProfile: { date, time, place: displayName, latitude, longitude, timezone, ayanamsa: 1 }
            }
        });
    } catch (err) {
        next(err);
    }
};
