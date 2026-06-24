import { envConfig } from "@/config/env/index.js";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";
import { generateRandomToken, hashToken } from "@/shared/utils/crypto-token.util.js";
import ms from "ms";
import { hashPassword } from "../utils/hash-password.js";
import { BadRequestError } from "@/shared/errors/bad-request.error.js";
import { AUTH_MESSAGES } from "../constants/auth.constants.js";

class PasswordResetService {

    // =============================
    // CREATE PASSWORD RESET TOKEN
    // =============================

    async createPasswordResetToken(userId: string): Promise<string> {
        const token = generateRandomToken();
        const tokenHash = hashToken(token);

        const expiresAt = new Date(Date.now() + ms(envConfig.auth.resetPasswordExpiresIn as ms.StringValue));

        await prisma.passwordResetToken.deleteMany({
            where: {
                userId,
                usedAt: null,
            }
        });

        await prisma.passwordResetToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
            }
        });

        return token;

    }

    // =======================
    // RESET PASSWORD
    // =======================

    async resetPassword(token: string, newPassword: string): Promise<void> {

        const tokenHash = hashToken(token);
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: {
                tokenHash,
            }
        });
        if (!resetToken) throw new BadRequestError(AUTH_MESSAGES.INVALID_PASSWORD_RESET_TOKEN);
        if (resetToken.usedAt) throw new BadRequestError(AUTH_MESSAGES.USED_PASSWORD_RESET_TOKEN);
        if (resetToken.expiresAt < new Date()) throw new BadRequestError(AUTH_MESSAGES.EXPIRED_PASSWORD_RESET_TOKEN);

        const passwordHash = await hashPassword(newPassword);

        await prisma.$transaction([

            // Update new password 
            // store as hashed password
            prisma.user.update({
                where: {
                    id: resetToken.userId,
                },
                data: {
                    passwordHash,
                }
            }),

            // Mark all password reset tokens as used
            // Invalidates all password reset links
            prisma.passwordResetToken.updateMany({
                where: {
                    userId: resetToken.userId,
                },
                data: {
                    usedAt: new Date(),
                }
            }),

            // Revoke all sessions
            // Prevents all previous session access
            prisma.session.deleteMany({
                where: {
                    userId: resetToken.userId,
                },
            })

        ]);

    }
}

export const passwordResetService = new PasswordResetService();