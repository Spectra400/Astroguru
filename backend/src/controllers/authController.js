const authService = require('../services/authService');

/**
 * REGISTER CONTROLLER
 */
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // 1. Call Service layer to create user
        const user = await authService.registerUser({ name, email, password });

        // 2. Generate JWT
        const token = authService.generateToken(user._id, user.role);

        // 3. Send structured response
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
    } catch (err) {
        next(err); // Centralized error handler takes it from here
    }
};

/**
 * LOGIN CONTROLLER
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Validation check (Simple)
        if (!email || !password) {
            const error = new Error('Please provide email and password');
            error.statusCode = 400;
            return next(error);
        }

        // 2. Call Service layer to authenticate
        const user = await authService.loginUser(email, password);

        // 3. Generate JWT
        const token = authService.generateToken(user._id, user.role);

        // 4. Send structured response
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET CURRENT USER CONTROLLER
 * Assumes 'protect' middleware has already run and attached user to req.user
 */
exports.getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            status: 'success',
            data: {
                user: req.user
            }
        });
    } catch (err) {
        next(err);
    }
};
