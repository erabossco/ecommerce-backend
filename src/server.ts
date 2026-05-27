import app from "./app.js";
import { envConfig } from "./config/env/index.js";

/**
 * Start Server
 */
const server = app.listen(envConfig.app.port, () => {
    console.log(`This server is running on port ${envConfig.app.port}`);
});



/**
 * Handle Graceful Server Shutdown
 */

const handleGracefulShutdown = (signal: string) => {
    console.log(`${signal} received. Server is shutting down gracefully...`);
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });

    // If it takes long time, apply forced shutdown
    setTimeout(() => {
        console.error("Forced shutdown.");
        process.exit(1);
    }, 10000);
}


/**
 * Receive signal and process server shutdown gracefully
 * SIGINT (Signal Interrupt) processes request for server interruption/termination 
 * Ctrl+C sends SIGINT signal and server closed gracefully
 * SIGTERM (Signal Terminate) processes request for server shutdown gracefully
 * When sever receives these signals, server stops accepting new request
 * but finish active requests. Then shutdown gracefully
 */

process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));
process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));