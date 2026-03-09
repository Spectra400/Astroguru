const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * SIGN JWT TOKEN
 * @param {string} userId - The database ID of the user
 * @param {string} role - User role (user/admin)
 */
const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

/**
 * REGISTER NEW USER
 * @param {Object} userData - { name, email, password }
 */
const registerUser = async (userData) => {
    const { name, email, password } = userData;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('User with this email already exists');
        error.statusCode = 400; // Client error
        error.status = 'fail';
        throw error;
    }

    // 2. Create User
    // Password hashing handled by User schema pre-save hook
    const user = await User.create({
        name,
        email,
        password,
    });

    // Mongoose automatically applies toJSON/transform to remove password
    return user;
};

/**
 * LOGIN USER
 * @param {string} email
 * @param {string} password
 */
const loginUser = async (email, password) => {
    // 1. Find user and explicitly select password (because select: false in Model)
    const user = await User.findOne({ email }).select('+password');

    // 2. Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401; // Unauthorized
        error.status = 'fail';
        throw error;
    }

    return user;
};

module.exports = {
    generateToken,
    registerUser,
    loginUser,
};
