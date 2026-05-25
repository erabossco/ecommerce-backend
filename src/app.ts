import express from "express";
import type { Request, Response } from "express";
import helmetConfig from "./config/security/helmet.config.js";
import corsConfig from "./config/security/cors.config.js";
import rateLimitConfig from "./config/security/rate-limit.config.js";

// Express application instance
const app = express();


/**
 * Trust the first proxy server.
 * This allows Express to correctly detect the real client IP address
 */
app.set("trust proxy", 1);


/**
 * Remove the "X-Powered-By" header, and improve security
 */
app.disable("x-powered-by");


/**
 * Helmet adds several HTTP security headers.
 * See src/config/security/helmet.config.ts
 */
app.use(helmetConfig);

/** 
 * CORS (cross origin resource sharing) allows access to backend from authorised frontend URLs
 * See src/config/security/cors.config.ts
*/
app.use(corsConfig);

/**
 * Express rateLimit protects API from brute-force attacks, spam, API abuse, 
 * credential stuffing, DDoS attack  
*/
app.use(rateLimitConfig);

/**
 * Body parsers 
 * Parse incoming request with JSON data and HTML form data
 * limit option protects the server from large payload attacks, 
 * and ensure better performance
 */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

/**
 * Routes
 */
app.get("/", (req: Request, res: Response) => {
    res.send("Server is running.");
});


// Export default 
export default app;