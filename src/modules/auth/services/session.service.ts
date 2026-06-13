import { prisma } from "@/infrastructure/database/prisma/index.js";
import type { CreateSessionParams } from "../types/index.js";
import ms from "ms";
import { envConfig } from "@/config/env/index.js";

// ==========================================
//  SESSION STORED IN AND LOAD FROM DATABASE
// ==========================================

class SessionService {
    /**
     * Create a new session for a user
     */
    async createSession({
        userId,
        userAgent,
        ipAddress,
    }: CreateSessionParams) {
        return prisma.session.create({
            data: {
                userId,
                userAgent: userAgent ?? null,
                ipAddress: ipAddress ?? null,
                expiresAt: new Date(Date.now() + ms(envConfig.jwt.refresh.expiresIn)),
                revokedAt: null,
            },
        });
    }

    /**
     * Get all active sessions for a user
     */
    async getActiveSessions(userId: string) {
        return prisma.session.findMany({
            where: {
                userId,
                revokedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    /**
     * Get session by ID
     */
    async getSessionById(sessionId: string) {
        return prisma.session.findFirst({
            where: {
                id: sessionId,
                revokedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
    }

    /**
     * Revoke a single session (logout from one device)
     */
    async revokeSession(sessionId: string) {
        return prisma.session.updateMany({
            where: {
                id: sessionId,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }

    /**
     * Revoke all sessions for a user (logout everywhere)
     */
    async revokeAllUserSessions(userId: string) {
        return prisma.session.updateMany({
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
     * Check if session is valid
     */
    async isSessionValid(sessionId: string): Promise<boolean> {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
        });

        if (!session) return false;
        if (session.revokedAt) return false;
        if (session.expiresAt < new Date()) return false;

        return true;
    }

    /**
     * Logout other devices but not the current one
     */
    async revokeOtherSessions(userId: string, currentSessionId: string) {
        return prisma.session.updateMany({
            where: {
                userId,
                id: { not: currentSessionId },
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }
}

export const sessionService = new SessionService();