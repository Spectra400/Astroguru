const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * AUTH PROTECTION MIDDLEWARE
 * Verifies the JWT and attaches the current user to the request object.
 */
const protect = async (req, res, next) => {
    try {
        // 1. Check if token exists in Authorization header
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            const error = new Error('You are not logged in! Please log in to get access.');
            error.statusCode = 401;
            error.status = 'fail';
            return next(error);
        }

        // 2. Verify token
        // jwt.verify is synchronous but we catch its errors in our catch block below
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check if user still exists in DB (Security: handles cases where user was deleted but token is still valid)
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            const error = new Error('The user belonging to this token no longer exists.');
            error.statusCode = 401;
            error.status = 'fail';
            return next(error);
        }

        // 4. GRANT ACCESS: Store user in req object for downstream middlewares/controllers
        // This makes 'req.user' available everywhere in protected routes
        req.user = currentUser;
        next();
    } catch (err) {
        // 5. Explicitly handle JWT-specific errors for client clarity
        if (err.name === 'JsonWebTokenError') {
            err.message = 'Invalid token. Please log in again!';
            err.statusCode = 401;
            err.status = 'fail';
        }
        if (err.name === 'TokenExpiredError') {
            err.message = 'Your token has expired! Please log in again.';
            err.statusCode = 401;
            err.status = 'fail';
        }

        next(err);
    }
};

module.exports = protect;
