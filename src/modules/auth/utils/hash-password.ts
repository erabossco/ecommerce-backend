import bcrypt from "bcrypt";
import { envConfig } from "@/config/env/index.js";

/**
 * Hashes a plain password using bcrypt
 * 
 * @param plainPassword - the raw password provided by the user
 * @returns a securely hash password string 
 */

export const hashPassword = async (plainPassword: string): Promise<string> => {
    return bcrypt.hash(plainPassword, envConfig.bcrypt.saltRounds);
}