const { DateTime } = require('luxon');
const { prokeralaRequest } = require('../integrations/prokerala');
const MahadashaReport = require('../models/MahadashaReport');
const User = require('../models/User');

/**
 * MAHADASHA SERVICE
 * Reads stored birth profile from User document — no form input required.
 */

/**
 * Generates a Mahadasha report using the user's stored birth profile.
 * @param {string} userId - Authenticated user's ID
 * @returns {Promise<Object>} Saved MahadashaReport document
 */
const getMahadasha = async (userId) => {
    // 1. Load user and birth profile from DB
    const user = await User.findById(userId).select('birthProfile');
    const profile = user?.birthProfile;

    if (!profile || !profile.date) {
        const err = new Error('No birth profile found. Please generate a Kundli first.');
        err.statusCode = 400;
        throw err;
    }

    const { date, time, place, latitude, longitude, timezone, ayanamsa } = profile;

    // 2. Parse date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute, second = 0] = time.split(':').map(Number);

    // 3. Build ISO 8601 datetime with Luxon
    const isoDatetime = DateTime.fromObject(
        { year, month, day, hour, minute, second },
        { zone: timezone }
    ).toISO({ suppressMilliseconds: true });

    // 4. Prokerala request params
    const requestParams = {
        datetime: isoDatetime,
        coordinates: `${latitude},${longitude}`,
        ayanamsa: ayanamsa ?? 1,
    };

    try {
        // 5. Fetch Dasha Periods from Prokerala
        console.log('[Mahadasha] Requesting Prokerala /dasha-periods with:', requestParams);
        const dashaData = await prokeralaRequest('GET', '/dasha-periods', requestParams);
        console.log('[Mahadasha] Raw Prokerala response received. Keys:', Object.keys(dashaData ?? {}));
        console.log('[Mahadasha] dasha_periods count:', dashaData?.data?.dasha_periods?.length ?? 'N/A');

        // 6. Save MahadashaReport
        const report = new MahadashaReport({
            user: userId,
            date,
            time,
            place,
            latitude,
            longitude,
            timezone,
            ayanamsa: ayanamsa ?? 1,
            reportData: dashaData,
        });

        return await report.save();
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getMahadasha,
};

