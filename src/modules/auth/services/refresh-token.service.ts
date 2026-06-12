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
    async createRefreshToken(payload: JwtPayload) {

        const refreshToken = jwtService.generateRefreshToken(payload);
        const tokenHash = hashToken(refreshToken);
        const expiresAt = new Date(
            Date.now() + ms(envConfig.jwt.refresh.expiresIn)
        );

        await prisma.refreshToken.create({
            data: {
                userId: payload.userId,
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
                userId: decoded.userId,
                revokedAt: null,
            },
        });

        if (!storedToken) {
            throw new Error("Invalid refresh token");
        }

        // Check expiry
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

        // Revoke all active tokens for user
        await prisma.refreshToken.updateMany({
            where: {
                userId: decoded.userId,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });

        // Issue a new token
        return this.createRefreshToken(decoded);
    }

    /**
     * Revoke all refresh tokens of a user (logout all devices)
     */
    async revokeAllUserTokens(userId: string) {
        await prisma.refreshToken.updateMany({
            where: {
                userId,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }

    /**
     * Revoke a single refresh token
     */
    async revokeToken(token: string) {
        const tokenHash = hashToken(token);

        await prisma.refreshToken.updateMany({
            where: {
                tokenHash,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }
}

export const refreshTokenService = new RefreshTokenService();