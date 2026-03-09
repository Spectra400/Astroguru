const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Ensures password is hidden from query results by default
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        /**
         * Stored birth profile — set on first Kundli generation.
         * Only overwritten via explicit PATCH /profile/birth-details.
         */
        birthProfile: {
            date: { type: String, trim: true },
            time: { type: String, trim: true },
            place: { type: String, trim: true },
            latitude: { type: Number },
            longitude: { type: Number },
            timezone: { type: String, trim: true },
            ayanamsa: { type: Number, default: 1 },
        },
    },
    {
        timestamps: true,
        // Automatically remove sensitive data when converting to JSON (e.g., res.json(user))
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        },
    }
);

/**
 * PRE-SAVE HOOK: Hash password before saving
 */
// Mongoose 9: async middleware is Promise-based, do NOT use next()
userSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return;

    // Hash the password with a cost factor of 12
    this.password = await bcrypt.hash(this.password, 12);
});

/**
 * INSTANCE METHOD: Compare candidate password with the hashed password in DB
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    // Note: Since 'select: false' is used, you must explicitly select 'password' 
    // in the service layer if you are using this method after a find query.
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
