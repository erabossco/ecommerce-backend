import { prisma } from "@/infrastructure/database/prisma/index.js";
import { passwordService } from "./password.service.js";
import { jwtService } from "./jwt.service.js";
import { sessionService } from "./session.service.js";
import type { AuthResponse, JwtPayload, RegisterContext, RegisterUserPayload } from "../types/auth.types.js";


class AuthService {
    /**
     * Register a new user
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

        // Create session and store it in database
        // (the sessionService in another file) is handling prisma actions
        const session = await sessionService.createSession({
            userId: user.id,
            ...(context.userAgent && { userAgent: context.userAgent }),
            ...(context.ipAddress && { ipAddress: context.ipAddress }),
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
    }
}

export const authService = new AuthService();


