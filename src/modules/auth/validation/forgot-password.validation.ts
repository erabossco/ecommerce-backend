import z from "zod";

/**
 * Forgot password validation
 */

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.email("Invalid email address").trim().toLowerCase(),
    }),
});