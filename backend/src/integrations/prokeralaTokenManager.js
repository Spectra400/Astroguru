const axios = require('axios');

/**
 * PROKERALA TOKEN MANAGER
 * Implements OAuth2 Client Credentials flow with in-memory token caching.
 * Token is automatically refreshed when expired.
 */

const TOKEN_URL = 'https://api.prokerala.com/token';

// In-memory token cache (module-level, persists for the lifetime of the Node.js process)
let tokenCache = {
    accessToken: null,
    expiresAt: null
};

/**
 * Checks if the cached token is still valid
 * @returns {boolean}
 */
const isCacheValid = () => {
    // Add a 60-second buffer to avoid using a token that's about to expire
    return tokenCache.accessToken && tokenCache.expiresAt && Date.now() < tokenCache.expiresAt - 60000;
};

/**
 * Fetches a fresh access token from Prokerala using Client Credentials grant
 * @returns {Promise<string>} freshAccessToken
 */
const fetchFreshToken = async () => {
    try {
        const response = await axios.post(
            TOKEN_URL,
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.PROKERALA_CLIENT_ID,
                client_secret: process.env.PROKERALA_CLIENT_SECRET
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, expires_in } = response.data;

        // Cache the new token along with its expiry timestamp
        tokenCache = {
            accessToken: access_token,
            expiresAt: Date.now() + expires_in * 1000
        };

        if (process.env.NODE_ENV === 'development') {
            console.log('🔑 Prokerala: New access token fetched and cached.');
        }

        return access_token;
    } catch (err) {
        const errMessage = err.response?.data?.message || err.message;
        console.error(`❌ Prokerala OAuth token fetch failed: ${errMessage}`);

        const error = new Error('Failed to authenticate with Prokerala API. Check your credentials.');
        error.statusCode = 503;
        error.status = 'error';
        throw error;
    }
};

/**
 * Returns a valid Prokerala access token.
 * Returns cached token if still valid; otherwise fetches and caches a new one.
 * @returns {Promise<string>} accessToken
 */
const getAccessToken = async () => {
    if (isCacheValid()) {
        return tokenCache.accessToken;
    }

    return await fetchFreshToken();
};

module.exports = {
    getAccessToken
};
