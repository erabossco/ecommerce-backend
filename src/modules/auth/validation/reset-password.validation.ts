import z from "zod";
import { SECURITY } from "../constants/auth.constants.js";

/**
 * Reset password validation
 */

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Reset token is required"),
        newPassword: z.string()
            .min(SECURITY.PASSWORD_MIN_LENGTH, `Password must be at least ${SECURITY.PASSWORD_MIN_LENGTH} characters`)
            .max(SECURITY.PASSWORD_MAX_LENGTH, `Password cannot exceed ${SECURITY.PASSWORD_MAX_LENGTH} characters`),
    }),
});
