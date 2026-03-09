const axios = require('axios');
const { getAccessToken } = require('./prokeralaTokenManager');

/**
 * PROKERALA API CLIENT
 * Reusable Axios-based client that auto-attaches a valid Bearer token.
 */

const PROKERALA_BASE_URL = 'https://api.prokerala.com/v2/astrology';

/**
 * Makes an authenticated request to the Prokerala REST API
 * @param {string} method - HTTP method ('GET', 'POST', etc.)
 * @param {string} endpoint - API endpoint path (e.g. '/birth-chart')
 * @param {Object} params - Query params (GET) or body (POST)
 * @returns {Promise<Object>} Prokerala API response data
 */
const prokeralaRequest = async (method, endpoint, params = {}) => {
    try {
        // 1. Get a valid token (cached or freshly fetched)
        const token = await getAccessToken();

        // 2. Build Axios config
        const config = {
            method: method.toUpperCase(),
            url: `${PROKERALA_BASE_URL}${endpoint}`,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        };

        // 3. For GET requests attach params as query string; for POST as body
        if (config.method === 'GET') {
            config.params = params;
        } else {
            config.data = params;
        }

        const response = await axios(config);
        return response.data;
    } catch (err) {
        // Normalize Prokerala API errors into app-standard format
        if (err.response) {
            const apiError = new Error(
                err.response.data?.errors?.[0]?.detail ||
                err.response.data?.message ||
                'Prokerala API request failed'
            );
            apiError.statusCode = err.response.status || 502;
            apiError.status = 'error';
            throw apiError;
        }

        // Network or unknown error
        const networkError = new Error('Could not connect to Prokerala API');
        networkError.statusCode = 503;
        networkError.status = 'error';
        throw networkError;
    }
};

module.exports = {
    prokeralaRequest
};
