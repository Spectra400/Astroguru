const axios = require('axios');
const { find } = require('geo-tz');

/**
 * GEOCODING SERVICE
 * Resolves place names to coordinates and timezones.
 */

// Nominatim requires a descriptive User-Agent
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'AstroApp/1.0.0 (contact@astroapp.com)';

/**
 * Resolves a place name string to lat/lng/timezone
 * @param {string} place - City or address string
 * @returns {Promise<Object>} { latitude, longitude, timezone }
 */
const geocodePlace = async (place) => {
    try {
        if (!place) {
            const error = new Error('Place name is required');
            error.statusCode = 400;
            throw error;
        }

        // 1. Call Nominatim API for geocoding
        const response = await axios.get(NOMINATIM_URL, {
            params: {
                q: place,
                format: 'json',
                limit: 1,
                addressdetails: 1
            },
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        const data = response.data;

        // 2. Handle location not found
        if (!data || data.length === 0) {
            const error = new Error(`Location not found: "${place}". Please provide a valid city name.`);
            error.statusCode = 400;
            error.status = 'fail';
            throw error;
        }

        const location = data[0];
        const latitude = parseFloat(location.lat);
        const longitude = parseFloat(location.lon);

        // 3. Resolve timezone from coordinates using geo-tz
        // find() returns an array of possible timezones, we take the first one
        const timezones = find(latitude, longitude);
        const timezone = timezones && timezones.length > 0 ? timezones[0] : 'UTC';

        return {
            latitude,
            longitude,
            timezone,
            displayName: location.display_name
        };
    } catch (err) {
        // If it's already a custom error, just rethrow it
        if (err.statusCode) throw err;

        // Handle network or system errors
        const systemError = new Error('Geocoding service currently unavailable');
        systemError.statusCode = 503;
        systemError.status = 'error';
        systemError.originalError = err.message;
        throw systemError;
    }
};

module.exports = {
    geocodePlace
};
