// Express types (shared)
// Make user data availabe with req
// req.user?

import type { Request } from "express";
import type { RequestUser } from "@/modules/auth/types/auth.types.js";

/**
 * Authenticated request (used after login middleware)
 */
export interface AuthRequest extends Request {
    user: RequestUser;
}