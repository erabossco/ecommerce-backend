import { prisma } from "@/infrastructure/database/prisma/index.js";
import { jwtService } from "./jwt.service.js";
import { hashToken } from "@/shared/utils/index.js";
import type { JwtPayload } from "../types/index.js";
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
    async createRefreshToken(payload: JwtPayload, sessionId: string) {

        const refreshToken = jwtService.generateRefreshToken(payload);
        const tokenHash = hashToken(refreshToken);
        const expiresAt = new Date(
            Date.now() + ms(envConfig.jwt.refresh.expiresIn)
        );

        await prisma.refreshToken.create({
            data: {
                sessionId,
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
        // Verify JWT signature
        const decoded = jwtService.verifyRefreshToken(token);

        // Hash incoming token
        const tokenHash = hashToken(token);

        // Find token in DB
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
        // Check session expiry 
        // Session is the single source of truth 
        if (!storedToken.session.isActive || storedToken.session.revokedAt) {
            throw new Error("Session expired");
        }
        // Check token expiry
        if (storedToken.expiresAt < new Date()) {
            throw new Error("Refresh token expired");
        }

        return decoded;
    }

    /**
     * Rotate refresh token (logout old token and issue new one)
     */
    async rotateRefreshToken(oldToken: string) {
        const decoded = await this.verifyRefreshToken(oldToken);
        const oldTokenHash = hashToken(oldToken);

        // Revoke this token
        await prisma.refreshToken.updateMany({
            where: {
                tokenHash: oldTokenHash,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });

        // Create a new token for the same session
        return this.createRefreshToken(decoded, decoded.sessionId);
    }

    /**
     * Revoke all refresh tokens of a user (logout all devices)
     */
    async revokeAllUserTokens(sessionId: string) {
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