import cors from "cors";
import { frontendUrls } from "../env/env.config.js"

/**
 * Cross-Origin Resource Sharing (CORS) configuration
 *
 * CORS is a browser security mechanism
 * that controls which frontend applications
 * are allowed to communicate with the backend API.
 *
 * This middleware helps:
 * Prevent unauthorized cross-origin requests
 * Allow trusted frontend applications
 * Support secure frontend-backend communication
 */

const corsConfig = cors({
    /**
     * Only authorised / listed frontend URLs are allowed
     */
    origin: frontendUrls,

    /**
     * Enables the browser to send:
     * Cookies, Authorization headers, Session tokens, Authentication credentials
     * Commonly required for:
     * JWT authentication, Session-based authentication, Secure login systems
     */
    credentials: true
});

/**
 * Export reusable CORS configuration 
 * Uses:
 * app.use(corsConfig);
 */
export default corsConfig;