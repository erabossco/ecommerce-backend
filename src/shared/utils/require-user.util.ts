import type { Request } from "express";
import type { RequestUser } from "@/modules/auth/types/index.js"
import { UnauthorizedError } from "../errors/index.js";
/**
 * Only to use where route is protected 
 * and requires logged in user data
 */
export function requireUser(req: Request): RequestUser {
    if (!req.user) {
        throw new UnauthorizedError("User is not authenticated");
    }
    return req.user;
}