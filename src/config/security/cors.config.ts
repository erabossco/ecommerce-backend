import cors from "cors";
import { clientUrls } from "../env/env.config.js"

/**
 * Cross-Origin Resource Sharing (CORS) configuration
 *
 * CORS is a browser security mechanism
 * that controls which client / frontend applications
 * are allowed to communicate with the backend API.
 *
 * This middleware helps:
 * Prevent unauthorized cross-origin requests
 * Allow authorised client applications
 * Support secure frontend-backend communication
 */

const corsConfig = cors({
    /**
     * Only authorised / listed client URLs are allowed
     */
    origin: clientUrls,

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