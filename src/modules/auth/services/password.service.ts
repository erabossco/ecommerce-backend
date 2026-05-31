import bcrypt from "bcrypt";
import { envConfig } from "@/config/env/index.js"


// Auth password service

export class PasswordService {
    private readonly saltRounds = envConfig.bcrypt.saltRounds;

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

export const passwordService = new PasswordService();

