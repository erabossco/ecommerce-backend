import { generateToken, verifyToken } from "../utils/index.js";
import type { JwtPayload } from "../types/auth.types.js";


class JwtService {
    // Generate access token
    generateAccessToken(payload: JwtPayload) {
        return generateToken({ payload, type: "ACCESS" });
    }

    // Generate refresh token
    generateRefreshToken(payload: JwtPayload) {
        return generateToken({ payload, type: "REFRESH" });
    }

    // Verify access token
    verifyAccessToken(token: string): JwtPayload {
        return verifyToken({ token, type: "ACCESS" });
    }

    // Verify refresh token
    verifyRefreshToken(token: string): JwtPayload {
        return verifyToken({ token, type: "REFRESH" });
    }
}

export const jwtService = new JwtService();