import express from "express";
import type { Request, Response } from "express";
import helmetConfig from "./config/security/helmet.config.js";
import corsConfig from "./config/security/cors.config.js";
import rateLimitConfig from "./config/security/rate-limit.config.js";
import { appRouter } from "./routes/index.js";

// Express application instance
const app = express();


/**
 * Trust the first proxy server.
 * This allows Express to correctly detect the real client IP address
 */
app.set("trust proxy", 1);


/**
 * Removing the "X-Powered-By" header improves security
 */
app.disable("x-powered-by");


/**
 * Helmet adds a set of HTTP security headers to improve application security
 * See src/config/security/helmet.config.ts
 */
app.use(helmetConfig);

/** 
 * CORS (cross origin resource sharing)
 * Controls which client applications are allowed to access the API
 * See src/config/security/cors.config.ts
*/
app.use(corsConfig);

/**
 * Express rateLimit 
 * Protects API from brute-force attacks, spam, API abuse, 
 * credential stuffing, Distributed Denial-of-service (DDoS) attack  
*/
app.use(rateLimitConfig);

/**
 * Body parsers 
 * Parse incoming request with JSON data and HTML form data
 * limit option protects the server from large payload attacks, 
 * and improves server performance
 */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

/**
 * Routes
 */
app.use("/api/v1", appRouter);
app.get("/", (req: Request, res: Response) => {
    res.send("Server is running.");
});


export default app;