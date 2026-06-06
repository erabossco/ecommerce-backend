import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/auth.types.js";

/**
 * Verify JWT token
 *
 * @param token - JWT token from client request
 * @param secret - Secret key used to verify the token signature
 * @returns Decoded JWT payload if the token is valid
 * @throws Error if the token is invalid or expired
 */

export const verifyToken = (token: string, secret: string): JwtPayload => {
    return jwt.verify(token, secret) as JwtPayload;
}