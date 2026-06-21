import { prisma } from "@/infrastructure/database/prisma/index.js";
import { generateRandomToken, hashToken } from "@/shared/utils/crypto-token.util.js";
import { envConfig } from "@/config/env/index.js";
import ms from "ms";

class EmailVerificationService {

    // ===============================
    // CREATE EMAIL VERIFICATION TOKEN
    // ================================

    async createEmailVerificationToken(userId: string): Promise<string> {

        const token = generateRandomToken();
        const tokenHash = hashToken(token);

        const expiresAt = new Date(Date.now() + ms(envConfig.auth.verifyEmailExpiresIn as ms.StringValue));

        await prisma.emailVerificationToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
            }
        });
        return token;
    }

    // ================
    // VERIFY EMAIL
    // ================

    async verifyEmail(token: string): Promise<boolean> {
        const tokenHash = hashToken(token);
        const verificationToken = await prisma.emailVerificationToken.findUnique({
            where: {
                tokenHash,
            },
        });
        if (!verificationToken) {
            throw new Error("Invalid verification token");
        }
        if (verificationToken.usedAt) {
            throw new Error("Verification token already used");
        }
        if (verificationToken.expiresAt < new Date()) {
            throw new Error("Verification token expired");
        }

        await prisma.$transaction([
            prisma.user.update({
                where: {
                    id: verificationToken.userId
                },
                data: {
                    emailVerifiedAt: new Date(),
                }
            }),

            prisma.emailVerificationToken.update({
                where: {
                    id: verificationToken.id,
                },
                data: {
                    usedAt: new Date(),
                },
            }),

        ]);

        return true;

    }

    // =========================
    // RESEND VERIFICATION EMAIL
    // =========================

    async resendVerificationToken(userId: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }
        if (user.emailVerifiedAt) {
            throw new Error("Email already verified");
        }

        // After sending new token, delete old unused token
        await prisma.emailVerificationToken.deleteMany({
            where: {
                userId,
                usedAt: null,
            },
        });
        return this.createEmailVerificationToken(userId);
    }

}

export const emailVerificationService = new EmailVerificationService();