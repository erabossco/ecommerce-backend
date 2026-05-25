import rateLimit from "express-rate-limit";

/**
 * Global API rate limiting middleware
 *
 * Purpose:
 * Protects the server from excessive requests,
 * brute-force attacks, spam traffic, and API abuse.
 *
 * How it works:
 * Tracks incoming requests based on client IP
 * Allows only a fixed number of requests
 * within a specific time window
 * Blocks further requests temporarily
 * after limit is exceeded.
 */

const rateLimitConfig = rateLimit({
    /** Each client/IP gets a fresh request quota in every 10 minutes */
    windowMs: 10 * 60 * 1000,

    /** A client can send up to 100 requests in 10 minutes */
    limit: 100,

    /** statusCode 429 = Too many requests */
    statusCode: 429,
    message: "Too many requests! Please try again later.",

    /** Enables standard rate limit headers */
    standardHeaders: true,

    /** Disables deprecated legacy headers */
    legacyHeaders: false
});

/** 
 * Export reuseable rateLimit configuration
 * Uses: 
 * app.use(rateLimitConfig);
 */

export default rateLimitConfig;


