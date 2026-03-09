const app = require('./app');
const connectDB = require('./config/db'); // Importing from config layer as requested
const dotenv = require('dotenv');

/**
 * PROCESS ERROR HANDLING
 * -----------------------
 * Catching synchronous errors (uncaughtException) at the very top.
 */
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Load environment variables
dotenv.config();

/**
 * START SERVER
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // 1. Connect to MongoDB Connection Function (from config layer)
        await connectDB();

        // 2. Start Express app listener
        const server = app.listen(PORT, () => {
            console.log(`\n============================================`);
            console.log(`🚀 AstroApp Server is LIVE!`);
            console.log(`📡 Port: ${PORT}`);
            console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
            console.log(`============================================\n`);
        });

        /**
         * ASYNC ERROR HANDLING
         * ---------------------
         * Handle unhandled promise rejections (e.g., failed DB connection if not caught)
         */
        process.on('unhandledRejection', (err) => {
            console.error('UNHANDLED REJECTION! 💥 Shutting down...');
            console.error(err.name, err.message);
            // Graceful shutdown: close server first, then exit
            server.close(() => {
                process.exit(1);
            });
        });

        // Graceful shutdown on SIGTERM (e.g., Kubernetes/system restart)
        process.on('SIGTERM', () => {
            console.log('👋 SIGTERM RECEIVED. Shutting down gracefully.');
            server.close(() => {
                console.log('💥 Process terminated!');
            });
        });

    } catch (error) {
        console.error(`❌ Server Initialization Failed: ${error.message}`);
        process.exit(1);
    }
};

startServer();
