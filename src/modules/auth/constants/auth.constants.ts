// ====================
// AUTH CONSTANTS
// ====================

/**
 * Token lifetime in seconds
 */
export const TOKEN_EXPIRY = {
    ACCESS_TOKEN: 15 * 60,
    REFRESH_TOKEN: 7 * 24 * 60 * 60,
    RESET_PASSWORD_TOKEN: 10 * 60,
    VERIFY_EMAIL_TOKEN: 30 * 60,
} as const;

/**
 * Cookie names used in Auth system
 */

export const AUTH_KOOKIE_KEY = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
} as const;

/**
 * JWT token types (for internal types)
 */
export const TOKEN_TYPE = {
    ACCESS: "ACCESS_TOKEN",
    REFRESH: "REFRESH_TOKEN",
    RESET_PASSWORD: "RESET_PASSWORD_TOKEN",
    VERIFY_EMAIL: "VERIFY_EMAIL_TOKEN",
} as const;

/**
 * Supported Auth providers based on Prisma AuthProvider enum
 */

export const AUTH_PROVIDER = {
    EMAIL: "EMAIL",
    GOOGLE: "GOOGLE",
    FACEBOOK: "FACEBOOK",
} as const;


/**
 * User roles based on Prisma Role enum
 */

export const USER_ROLE = {
    USER: "USER",
    ADMIN: "ADMIN",
    STAFF: "STAFF",
} as const;

/**
 * Default session config
 */

export const SESSION_CONFIG = {
    MAX_SESSIONS_PER_USER: 5,
    SESSION_EXPIRY_DAYS: 30,
} as const;

/**
 * Securit rules
 */

export const SECURITY = {
    PASSWORD_MIN_LENGHT: 8,
    PASSWORD_MAX_LENGHT: 40,
    BCRYPT_SALT_ROUNDS: 10,
} as const;

/**
 * HTTP status messages (auth related only)
 */

export const AUTH_MESSAGES = {
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logout successful",

    INVALID_CREDENTIALS: "Invalid email or password",
    UNAUTHORIZED: "Unauthoriszd access",
    FORBIDDEN: "Forbidden access",

    TOKEN_EXPIRED: "Token has expired",
    TOKEN_INVALID: "Invalid token",

    EMAIL_EXISTS: "Email already exists",
    EMAIL_NOT_FOUND: "Email not found",

    PASSWORD_RESET_SUCCESS: "Password reset successful",
    EMAIL_CHANGED: "Email changed successfully",
    EMAIL_VERIFIED: "Email verified successfully",
} as const; 
