import bcrypt from "bcrypt";

/**
 * Compares a plain password with a bcryp hashed password
 * 
 * @param plainPassword - raw password provided by the user
 * @param hashedPassword - bcrypt hashed password stored in database
 * @returns a promise that resolves to 
 * `true` if the passwords match
 * `false` if the passwords do not match 
 */
export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
};