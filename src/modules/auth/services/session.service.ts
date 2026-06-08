import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { envConfig } from '@/config/env/index.js';


const connectionString = envConfig.database.url;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
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
                expiresAt: expiresAt ?? null,
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
    async revokeSession(sessionId: string) {
        return prisma.session.update({
            where: {
                id: sessionId,
            },
            data: {
                isActive: false,
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
            },
            data: {
                isActive: false,
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
        if (!session.isActive) return false;

        if (session.expiresAt && session.expiresAt < new Date()) {
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
}

export const sessionService = new SessionService();