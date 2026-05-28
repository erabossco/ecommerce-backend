import z from "zod";

/**
 * Login validation
 */

export const loginSchema = z.object({
    body: z.object({
        email: z.email("Invalid email address").trim().toLowerCase(),
        password: z.string().min(1, "Password is required"),
    }),
});
