const mongoose = require('mongoose');

/**
 * KUNDLI REPORT MODEL
 * Stores generated Kundli data joined with user and input details.
 */
const kundliReportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
            index: true
        },
        date: {
            type: String,
            required: [true, 'Birth date is required'],
            trim: true
        },
        time: {
            type: String,
            required: [true, 'Birth time is required'],
            trim: true
        },
        place: {
            type: String,
            required: [true, 'Birth place name is required'],
            trim: true
        },
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        },
        timezone: {
            type: String,
            trim: true
        },
        ayanamsa: {
            type: Number,
            default: 1 // Default to Lahiri
        },
        reportData: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, 'Report data content is required']
        }
    },
    {
        timestamps: true,
        minimize: false // Ensures empty objects are stored if necessary
    }
);

// Optional: Add a compound index for common query pattern (user + creation date)
kundliReportSchema.index({ user: 1, createdAt: -1 });

const KundliReport = mongoose.model('KundliReport', kundliReportSchema);

module.exports = KundliReport;
