import z from "zod";


/**
 * Verify email validation
 */

export const verifyEmailSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Verification token is required")
    }),
}); 