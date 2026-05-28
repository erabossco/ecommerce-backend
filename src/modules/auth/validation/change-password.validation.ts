import z from "zod";
import { SECURITY } from "../constants/auth.constants.js";

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
