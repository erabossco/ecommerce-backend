import bcrypt from "bcrypt";
import { SECURITY } from "../constants/auth.constants.js";

/**
 * Hashes a plain password using bcrypt
 * 
 * @param plainPassword - the raw password provided by the user
 * @returns a securely hash password string 
 */

export const hashPassword = async (plainPassword: string): Promise<string> => {
    return bcrypt.hash(plainPassword, SECURITY.BCRYPT_SALT_ROUNDS);
}