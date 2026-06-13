import { prisma } from "@/infrastructure/database/prisma/index.js"
import type { CreateSessionParams } from '../types/index.js';

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
        expiresAt,
    }: CreateSessionParams) {
        return prisma.session.create({
            data: {
                userId,
                userAgent: userAgent ?? null,
                ipAddress: ipAddress ?? null,
                expiresAt,
                isActive: true,
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
                isActive: true,
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
        return prisma.session.findUnique({
            where: {
                id: sessionId,
            },
        });
    }

    /**
     * Revoke a single session (logout from one device)
     */
    async revokeCurrentSession(sessionId: string) {
        return prisma.session.updateMany({
            where: {
                id: sessionId,
                isActive: true,
                revokedAt: null,
            },
            data: {
                isActive: false,
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
                isActive: true,
                revokedAt: null,
            },
            data: {
                isActive: false,
                revokedAt: new Date(),
            },
        });
    }

    /**
     * Check if session is valid
     */
    async isSessionValid(sessionId: string): Promise<boolean> {
        const session = await prisma.session.findUnique({
            where: {
                id: sessionId,
            },
        });

        if (!session) {
            return false;
        }

        if (!session.isActive) {
            return false;
        }

        if (session.revokedAt) {
            return false;
        }

        if (session.expiresAt < new Date()) {
            return false;
        }

        return true;
    }

    /**
     * Count active sessions for a user
     */
    async countActiveSessions(userId: string) {
        return prisma.session.count({
            where: {
                userId,
                isActive: true,
                revokedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
    }


    /**
     * Delete expired sessions (cleanup job use-case)
     */
    async deleteExpiredSessions() {
        return prisma.session.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }


    /**
     * Logout other devices but not the current one
     */

    async revokeOtherSessions(userId: string, currentSessionId: string) {
        return prisma.session.updateMany({
            where: {
                userId,
                id: {
                    not: currentSessionId,
                },
            },
            data: {
                isActive: false,
                revokedAt: new Date(),
            },
        });
    }
}

export const sessionService = new SessionService();