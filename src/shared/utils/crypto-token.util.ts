// Token utility (shared)
// Crypto is built-in with node

import crypto from "crypto";

// =================================
// GENERATE RANDOM TOKEN WITH CRYPTO
// =================================
export const generateRandomToken = (length: number = 32): string => {
    return crypto.randomBytes(length).toString("hex");
};


// ===========
// HASH TOKEN
// ===========

export const hashToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
}