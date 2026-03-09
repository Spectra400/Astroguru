const mongoose = require('mongoose');

/**
 * MAHADASHA REPORT MODEL
 * Stores generated Vimshottari Dasha data joined with user and input details.
 */
const mahadashaReportSchema = new mongoose.Schema(
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
            required: [true, 'Mahadasha report data content is required']
        }
    },
    {
        timestamps: true,
        minimize: false // Ensures empty objects are stored if necessary
    }
);

// Compound index for optimized history lookups
mahadashaReportSchema.index({ user: 1, createdAt: -1 });

const MahadashaReport = mongoose.model('MahadashaReport', mahadashaReportSchema);

module.exports = MahadashaReport;
