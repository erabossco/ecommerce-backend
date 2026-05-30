import jwt from "jsonwebtoken";
import { envConfig } from "@/config/env/index.js";
import type { JwtPayload } from "../types/auth.types.js";
import { TOKEN_TYPE } from "../constants/auth.constants.js";

type verifyTokenParams = {
    token: string;
    type: keyof typeof TOKEN_TYPE;
}
/**
 * Verify JWT token
 * 
 * @param token - JWT token from client request 
 * @returns decoded payload if token is valid
 */

export const verifyToken = ({ token, type }: verifyTokenParams): JwtPayload => {
    let secret: string;

    switch (type) {
        case "ACCESS":
            secret = envConfig.jwt.access.secret;
            break;

        case "REFRESH":
            secret = envConfig.jwt.refresh.secret;
            break;
        default: throw new Error("Invalid token type");
    }
    return jwt.verify(token, secret) as JwtPayload;
}
