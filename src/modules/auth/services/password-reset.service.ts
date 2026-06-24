import { envConfig } from "@/config/env/index.js";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";
import { generateRandomToken, hashToken } from "@/shared/utils/crypto-token.util.js";
import ms from "ms";

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
}

export const passwordResetService = new PasswordResetService();