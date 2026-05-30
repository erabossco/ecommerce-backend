// Token utility (shared)
// Crypto is built-in with node

import crypto from "crypto";
export const generateRandomToken = (length = 32): string => {
    return crypto.randomBytes(length).toString("hex");
};

export const hashToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
}