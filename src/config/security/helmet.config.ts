import helmet from "helmet";

/**
 * Helmet security middleware configuration
 *
 * Helmet helps secure an Express application
 * by setting various HTTP security headers.
 *
 * These headers protect the application from:
 * Cross-site scripting (XSS)
 * Clickjacking
 * MIME-type sniffing
 * Information leakage
 * Other common web vulnerabilities
 */

const helmetConfig = helmet({
    /**
     * ------ IMPORTANT -------
     * Content Security Policy (CSP)
     * Temporarily disabled during development
     * Enable and configure properly before production deployment.
     */
    contentSecurityPolicy: false,
});

/**
 * Export reuseable helmet configuration
 * Uses:
 * app.use(helmetConfig);
 */

export default helmetConfig;