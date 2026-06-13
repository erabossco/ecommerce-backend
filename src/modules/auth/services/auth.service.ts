import { prisma } from "@/infrastructure/database/prisma/index.js";
import { passwordService } from "./password.service.js";
import { jwtService } from "./jwt.service.js";
import { sessionService } from "./session.service.js";
import type {
    AuthResponse,
    AuthTokens,
    JwtPayload,
    LoginContext,
    LoginUserPayload,
    LogoutResponse,
    RefreshTokenPayload,
    RegisterContext,
    RegisterUserPayload
} from "../types/auth.types.js";
import { refreshTokenService } from "./refresh-token.service.js";
import { envConfig } from "@/config/env/index.js";
import ms from "ms";


class AuthService {

    // ==========================
    // USER REGISTRATION SERVICE
    // ==========================

    /**
     * Register a new user
     * 
     * @param payload (user form data)
     * @param context (user agent, ip address)
     * @returns user and tokens
     */

    async registerUser(payload: RegisterUserPayload, context: RegisterContext): Promise<AuthResponse> {

        // Check if user is already exists 
        // If user exist, throw error and prevent registering with same email
        const existingUser = await prisma.user.findUnique({
            where: { email: payload.email }
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        // Hash password with plain password from payload
        const passworHash = await passwordService.hashPassword(payload.password);

        // Register user and store data in database
        const user = await prisma.user.create({
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                passwordHash: passworHash,
            }
        });

        const sessionExpiresAt = new Date(Date.now() + ms(envConfig.jwt.refresh.expiresIn));

        // Create session and store it in database
        // (the sessionService in another file) is handling prisma actions
        const session = await sessionService.createSession({
            userId: user.id,
            ...(context.userAgent && { userAgent: context.userAgent }),
            ...(context.ipAddress && { ipAddress: context.ipAddress }),
            expiresAt: sessionExpiresAt,
        });


        // Generating accessToken and refreshToken
        // This is not storing in database 
        // Later verification will be done using JWT signature and secret key
        const jwtPayload: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            sessionId: session.id,
        }

        const accessToken = jwtService.generateAccessToken(jwtPayload);
        const refreshToken = jwtService.generateRefreshToken(jwtPayload);

        // Return user and tokens 
        return {
            user,
            tokens: {
                accessToken,
                refreshToken,
            }
        };
    };

    // ===========================
    // LOGIN SERVICE
    // ===========================

    /**
     * 
     * Login user
     * 
     * @param payload (user form data) 
     * @param context (user agent and ip address)
     * @returns user and tokens 
     */

    async loginUser(payload: LoginUserPayload, context: LoginContext): Promise<AuthResponse> {

        // Check if user exists.
        // if no email matches, throw error
        const user = await prisma.user.findUnique({
            where: {
                email: payload.email,
            }
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        // Check if login with password is allowed
        if (!user.passwordHash) {
            throw new Error("Password login is unavailable")
        }

        // If user email exists and login with password is active
        // check if provided password is correct
        const isPasswordValid = await passwordService.comparePassword(payload.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        // Check if the account has been soft-deleted.
        // The account remains in the database for audit purposes,
        // but should be treated as non-existent by the application.
        if (user.isDeleted) {
            throw new Error("Account not found");
        }

        // If all data is valid, check if user is ative 
        if (!user.isActive) {
            throw new Error("Account disabled");
        }

        const sessionExpiresAt = new Date(Date.now() + ms(envConfig.jwt.refresh.expiresIn));
        // Create a session with the login data
        const session = await sessionService.createSession({
            userId: user.id,
            ...(context.userAgent && { userAgent: context.userAgent }),
            ...(context.userAgent && { ipAddress: context.ipAddress }),
            expiresAt: sessionExpiresAt,
        });

        // Generate access and refresh token
        const jwtPayload: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            sessionId: session.id,
        }
        const accessToken = jwtService.generateAccessToken(jwtPayload)
        const refreshToken = jwtService.generateRefreshToken(jwtPayload)

        // Return user and tokens
        return {
            user,
            tokens: {
                accessToken,
                refreshToken,
            }
        };
    };

    // ===========================================
    // REFRESH ACCESS TOKEN & ROTATE REFRESH TOKEN
    // ===========================================

    /**
     * Validates the refresh token and associated session,
     * then generates a new access token and rotates the refresh token.
     *
     * @param payload Contains the current refresh token.
     * @returns A new access token and refresh token pair.
     */

    async refreshToken(payload: RefreshTokenPayload): Promise<AuthTokens> {

        const decoded = await refreshTokenService.verifyRefreshToken(payload.refreshToken);
        const isSessionValid = await sessionService.isSessionValid(decoded.sessionId);

        if (!isSessionValid) {
            throw new Error("Session expired");
        }

        const accessToken = jwtService.generateAccessToken(decoded);
        const refreshToken = await refreshTokenService.rotateRefreshToken(payload.refreshToken);

        return { accessToken, refreshToken };
    };

    // ========================
    // LOGOUT CURRENT DEVICE
    // ========================

    /**
     * Revoke the current session in the database
     * This will logout the current device
     * @param sessionId (current session id)
     * @returns logout confirmation
     */

    async logout(sessionId: string): Promise<LogoutResponse> {

        await sessionService.revokeCurrentSession(sessionId);
        // Confirm the client that logout is successful
        return { success: true };
    };

    // ====================
    // LOGOUT ALL DEVICES
    // ====================


    /**
     * Revoke all the sessions in the database
     * This will logout all devices
     * @param userId 
     * @returns logout confirmation
     */

    async logoutAllDevices(userId: string): Promise<LogoutResponse> {
        await sessionService.revokeAllUserSessions(userId);

        return {
            success: true
        };
    }
}

export const authService = new AuthService();