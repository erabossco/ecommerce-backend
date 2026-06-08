import { generateToken, verifyToken } from "../utils/index.js";
import type { JwtPayload } from "../types/auth.types.js";
import { envConfig } from "@/config/env/index.js";

class JwtService {
    // Generate access token
    generateAccessToken(payload: JwtPayload): string {
        return generateToken({ payload, secret: envConfig.jwt.access.secret, expiresIn: envConfig.jwt.access.expiresIn });
    }

    // Generate refresh token

    generateRefreshToken(payload: JwtPayload): string {
        return generateToken({ payload, secret: envConfig.jwt.refresh.secret, expiresIn: envConfig.jwt.refresh.expiresIn });
    }

    // Verify access token

    verifyAccessToken(token: string): JwtPayload {
        return verifyToken(token, envConfig.jwt.access.secret)
    }

    // Verify refresh token

    verifyRefreshToken(token: string): JwtPayload {
        return verifyToken(token, envConfig.jwt.refresh.secret)
    }
}

export const jwtService = new JwtService();