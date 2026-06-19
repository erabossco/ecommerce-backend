import { prisma } from "@/infrastructure/database/prisma/index.js";
import { passwordService } from "./password.service.js";
import { jwtService } from "./jwt.service.js";
import { sessionService } from "./session.service.js";
import { refreshTokenService } from "./refresh-token.service.js";

import type {
    AuthResponse,
    AuthTokens,
    CurrentUserProfile,
    JwtPayload,
    LoginContext,
    LoginUserPayload,
    LogoutResponse,
    RefreshTokenPayload,
    RegisterContext,
    RegisterUserPayload
} from "../types/auth.types.js";

import { NotFoundError } from "@/shared/errors/not-found.error.js";

/**
 * AUTH SERVICE
 */
class AuthService {

    // ==========================
    // REGISTER
    // ==========================
    async registerUser(
        payload: RegisterUserPayload,
        context: RegisterContext
    ): Promise<AuthResponse> {

        const existingUser = await prisma.user.findUnique({
            where: { email: payload.email }
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        const passwordHash = await passwordService.hashPassword(payload.password);

        const user = await prisma.user.create({
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                passwordHash,
            }
        });

        const session = await sessionService.createSession({
            userId: user.id,
            ...(context.userAgent ? { userAgent: context.userAgent } : {}),
            ...(context.ipAddress ? { ipAddress: context.ipAddress } : {}),
        });

        const jwtPayload: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            sessionId: session.id,
        };

        const accessToken = jwtService.generateAccessToken(jwtPayload);
        const refreshToken = await refreshTokenService.createRefreshToken(jwtPayload);
        // do not return passwordHash in response 
        const { passwordHash: _, ...safeUserData } = user;

        return {
            user: safeUserData,
            tokens: { accessToken, refreshToken }
        };
    }

    // ==========================
    // LOGIN
    // ==========================
    async loginUser(
        payload: LoginUserPayload,
        context: LoginContext
    ): Promise<AuthResponse> {

        const user = await prisma.user.findUnique({
            where: { email: payload.email }
        });

        if (!user || !user.passwordHash) {
            throw new Error("Invalid credentials");
        }

        const isValid = await passwordService.comparePassword(
            payload.password,
            user.passwordHash
        );

        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        if (user.isDeleted) throw new Error("Account not found");
        if (!user.isActive) throw new Error("Account disabled");

        const session = await sessionService.createSession({
            userId: user.id,
            ...(context.userAgent ? { userAgent: context.userAgent } : {}),
            ...(context.ipAddress ? { ipAddress: context.ipAddress } : {}),
        });

        const jwtPayload: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            sessionId: session.id,
        };

        const accessToken = jwtService.generateAccessToken(jwtPayload);
        const refreshToken = await refreshTokenService.createRefreshToken(jwtPayload);
        // do not return passwordHash in response 
        const { passwordHash: _, ...safeUserData } = user;

        return {
            user: safeUserData,
            tokens: { accessToken, refreshToken }
        };
    }

    // ==========================
    // REFRESH TOKEN
    // ==========================
    async refreshToken(payload: RefreshTokenPayload): Promise<AuthTokens> {

        const decoded = await refreshTokenService.verifyRefreshToken(
            payload.refreshToken
        );

        const isValidSession = await sessionService.isSessionValid(
            decoded.sessionId
        );

        if (!isValidSession) {
            throw new Error("Session expired");
        }

        const accessToken = jwtService.generateAccessToken(decoded);

        const refreshToken = await refreshTokenService.rotateRefreshToken(
            payload.refreshToken
        );

        return { accessToken, refreshToken };
    }

    // ==========================
    // LOGOUT
    // ==========================
    async logout(sessionId: string): Promise<LogoutResponse> {
        await sessionService.revokeSession(sessionId);
        return { success: true };
    }

    // ==========================
    // LOGOUT ALL
    // ==========================
    async logoutAllDevices(userId: string): Promise<LogoutResponse> {
        await sessionService.revokeAllUserSessions(userId);
        return { success: true };
    }

    // ==========================
    // CURRENT USER
    // ==========================
    async getCurrentUser(userId: string): Promise<CurrentUserProfile> {

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
                isDeleted: false,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                role: true,
                isEmailVerified: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;
    }
}

export const authService = new AuthService();