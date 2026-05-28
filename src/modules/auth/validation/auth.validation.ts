import z from "zod";
import { SECURITY } from "../constants/auth.constants.js";


/**
 * Register validation
 */

export const registerSchema = z.object({
    body: z.object({
        firstName: z.string().trim().min(2, "at least 2 characters").max(15, "maximum 15 characters"),
        lastName: z.string().trim().min(2, "at least 2 characters").max(15, "maximum 15 characters"),
        email: z.email("Invalid email address").trim().toLowerCase(),
        password: z.string()
            .min(SECURITY.PASSWORD_MIN_LENGHT, `Password must be at least ${SECURITY.PASSWORD_MIN_LENGHT} characters`)
            .max(SECURITY.PASSWORD_MAX_LENGHT, `Password cannot exceed ${SECURITY.PASSWORD_MAX_LENGHT} characters`),
    }),
});

/**
 * Login validation
 */

export const loginSchema = z.object({
    body: z.object({
        email: z.email("Invalid email address").trim().toLowerCase(),
        password: z.string().min(1, "Password is required"),
    }),
});

/**
 * Refresh token validation
 */

export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, "Refresh token is required"),
    }),
});

/**
 * Forgot password validation
 */

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.email("Invalid email address").trim().toLowerCase(),
    }),
});

/**
 * Reset password validation
 */

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Reset token is required"),
        newPassword: z.string()
            .min(SECURITY.PASSWORD_MIN_LENGHT, `Password must be at least ${SECURITY.PASSWORD_MIN_LENGHT} characters`)
            .max(SECURITY.PASSWORD_MAX_LENGHT, `Password cannot exceed ${SECURITY.PASSWORD_MAX_LENGHT} characters`),
    }),
});

/**
 * Change password validation
 */

export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string()
            .min(SECURITY.PASSWORD_MIN_LENGHT, `Password must be at least ${SECURITY.PASSWORD_MIN_LENGHT} characters`)
            .max(SECURITY.PASSWORD_MAX_LENGHT, `Password cannot exceed ${SECURITY.PASSWORD_MAX_LENGHT} characters`),
    }),
});

/**
 * Verify email validation
 */

export const verifyEmailSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Verification token is required")
    }),
});