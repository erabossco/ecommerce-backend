import { prisma } from "@/infrastructure/database/prisma/index.js";
import { jwtService } from "./jwt.service.js";
import { hashToken } from "@/shared/utils/index.js";
import type { DecodedJwtPayload, JwtPayload } from "../types/index.js";
import ms from "ms";
import { envConfig } from "@/config/env/index.js";

/**
 * Refresh Token Service
 * Handles creation, verification, rotation, and revocation of refresh tokens
 */
class RefreshTokenService {
    /**
     * Create refresh token and store hashed version in database
     */
    async createRefreshToken(payload: JwtPayload) {

        const refreshToken = jwtService.generateRefreshToken(payload);
        const tokenHash = hashToken(refreshToken);

        const expiresAt = new Date(
            Date.now() + ms(envConfig.jwt.refresh.expiresIn)
        );

        await prisma.refreshToken.create({
            data: {
                sessionId: payload.sessionId,
                tokenHash,
                expiresAt,
            },
        });

        return refreshToken;
    }

    /**
     * Verify refresh token (JWT and DB check)
     */
    async verifyRefreshToken(token: string) {
        const decoded = jwtService.verifyRefreshToken(token) as DecodedJwtPayload;

        const tokenHash = hashToken(token);

        const storedToken = await prisma.refreshToken.findFirst({
            where: {
                tokenHash,
                revokedAt: null,
            },
            include: {
                session: true,
            }
        });

        if (!storedToken) {
            throw new Error("Invalid refresh token");
        }

        if (storedToken.session.revokedAt) {
            throw new Error("Session expired");
        }

        if (storedToken.expiresAt < new Date()) {
            throw new Error("Refresh token expired");
        }
        const { iat, exp, ...payload } = decoded;
        return payload;
    }

    /**
     * Rotate refresh token (logout old token and issue new one)
     */
    async rotateRefreshToken(oldToken: string) {
        const decoded = await this.verifyRefreshToken(oldToken);

        const oldTokenHash = hashToken(oldToken);

        await prisma.refreshToken.updateMany({
            where: {
                tokenHash: oldTokenHash,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });

        return this.createRefreshToken(decoded);
    }

    /**
     * Revoke all refresh tokens of a session
     */
    async revokeSessionTokens(sessionId: string) {
        await prisma.refreshToken.updateMany({
            where: {
                sessionId,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }
}

export const refreshTokenService = new RefreshTokenService();