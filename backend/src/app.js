const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

/**
 * PRODUCTION-READY MIDDLEWARES
 */

// 1. Security Headers
app.use(helmet());

// 2. Cross-Origin Resource Sharing
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Request Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/**
 * ROUTES
 */
const authRoutes = require('./routes/authRoutes');
const kundliRoutes = require('./routes/kundliRoutes');
const mahadashaRoutes = require('./routes/mahadashaRoutes');
const profileRoutes = require('./routes/profileRoutes');


// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to AstroApp API',
        version: '1.0.0'
    });
});

// Health Check — used by Render to confirm the service is alive
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Auth Routes
app.use('/api/v1/auth', authRoutes);

// Kundli Routes
app.use('/api/v1/kundli', kundliRoutes);

// Mahadasha Routes
app.use('/api/v1/mahadasha', mahadashaRoutes);

// Profile Routes (birth profile CRUD)
app.use('/api/v1/profile', profileRoutes);


// app.use('/api/v1/users', userRouter); // Future routes go here

/**
 * ERROR HANDLING
 */

// ✅ Express 5 compatible 404 handler
app.use((req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    err.status = 'fail';
    next(err);
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        console.error('ERROR 💥:', err);
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            error: err
        })
    });
});

module.exports = app;