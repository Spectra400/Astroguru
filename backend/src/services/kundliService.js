const { DateTime } = require('luxon');
const geocodingService = require('../integrations/geocodingService');
const { prokeralaRequest } = require('../integrations/prokerala');
const KundliReport = require('../models/KundliReport');
const User = require('../models/User');

/**
 * KUNDLI SERVICE
 * Orchestrates geocoding, Prokerala API calls, and birth profile persistence.
 */

/**
 * Generates a Kundli chart from birth details.
 * Also saves birth profile to User on FIRST generation only (set-once).
 * @param {Object} birthDetails - { date, time, place }
 * @param {string} userId
 * @returns {Promise<Object>} Saved KundliReport document
 */
const getKundli = async ({ date, time, place }, userId) => {
    // 1. Resolve place to coordinates and timezone
    const { latitude, longitude, timezone, displayName } = await geocodingService.geocodePlace(place);

    // 2. Parse date and time parts
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute, second = 0] = time.split(':').map(Number);

    // 3. Build ISO 8601 datetime with timezone offset via Luxon
    const isoDatetime = DateTime.fromObject(
        { year, month, day, hour, minute, second },
        { zone: timezone }
    ).toISO({ suppressMilliseconds: true });

    // 4. Prepare Prokerala request params
    const requestParams = {
        datetime: isoDatetime,
        coordinates: `${latitude},${longitude}`,
        ayanamsa: 1
    };

    try {
        // 5. Fetch Kundli data, Planet positions, and Navamsha (D9) in parallel
        console.log('[Kundli] Fetching Prokerala APIs with params:', requestParams);
        const [kundliData, planetData, navamshaData] = await Promise.allSettled([
            prokeralaRequest('GET', '/kundli', requestParams),
            prokeralaRequest('GET', '/planet-position', requestParams),
            prokeralaRequest('GET', '/divisional-chart', { ...requestParams, chart_type: 'D9' }),
        ]);

        // Extract fulfilled values; fall back to null if a call fails
        const kundliResult = kundliData.status === 'fulfilled' ? kundliData.value : null;
        const planetResult = planetData.status === 'fulfilled' ? planetData.value : null;
        const navamshaResult = navamshaData.status === 'fulfilled' ? navamshaData.value : null;

        console.log('[Kundli] /kundli status:', kundliData.status);
        console.log('[Kundli] /planet-position status:', planetData.status, '| Planets:', planetResult?.data?.planet_position?.length ?? 'N/A');
        console.log('[Kundli] /divisional-chart D9 status:', navamshaData.status, '| D9 Planets:', navamshaResult?.data?.planet_position?.length ?? 'N/A');

        // 6. Save KundliReport with all three data sets
        const report = new KundliReport({
            user: userId,
            date,
            time,
            place: displayName,
            latitude,
            longitude,
            timezone,
            ayanamsa: 1,
            reportData: {
                kundli: kundliResult,
                planets: planetResult,
                navamsha: navamshaResult,  // D9 divisional chart (null if API call failed)
            }
        });

        const savedReport = await report.save();

        // 7. ALWAYS update the birth profile — not just on first generation.
        // Previously this was "set-once" (only if birthProfile.date didn't exist),
        // which caused Mahadasha to always use the first-ever birth date, not the
        // new one the user entered. Now we always keep it in sync.
        await User.findByIdAndUpdate(
            userId,
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
            }
        );

        console.log('[Kundli] Birth profile updated for user', userId, '→', date, time, timezone);


        return savedReport;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getKundli,
};

