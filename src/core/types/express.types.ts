// Express types (shared)
// Make user data availabe with req
// req.user?

import type { Request } from "express";

export interface AuthRequest extends Request {
    user?: unknown;
}