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
