// ====================
// AUTH CONSTANTS
// ====================

/**
 * Cookie names used in Auth system
 */

export const AUTH_COOKIE_KEY = {
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
 * Password rules
 */

export const SECURITY = {
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 32,
    // bcrypt salt rounds are loaded from envConfig to avoid duplication of runtime config
} as const;

/**
 * HTTP status messages (auth related only)
 */

export const AUTH_MESSAGES = {
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logout successful",
    LOGOUT_ALL_SUCCESS: "Logged out from all devices",

    INVALID_CREDENTIALS: "Invalid email or password",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Forbidden access",

    TOKEN_EXPIRED: "Token has expired",
    TOKEN_INVALID: "Invalid token",

    REFRESH_TOKEN_MISSING: "Refresh token missing",
    TOKEN_REFRESHED: "Token refreshed successfully",

    EMAIL_EXISTS: "Email already exists",
    EMAIL_NOT_FOUND: "Email not found",

    INVALID_PASSWORD_RESET_TOKEN: "Invalid password reset token",
    USED_PASSWORD_RESET_TOKEN: "Password reset token already used",
    EXPIRED_PASSWORD_RESET_TOKEN: "Password reset token expired",
    PASSWORD_RESET_SUCCESS: "Password reset successful",
    EMAIL_CHANGED: "Email changed successfully",
    EMAIL_VERIFIED: "Email verified successfully",
} as const; 
