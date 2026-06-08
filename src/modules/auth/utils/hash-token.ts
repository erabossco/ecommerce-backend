import crypto from "crypto";

// Hash tokens before storing them in the database
// Adds extra layer security
// Prevents attackers from using raw tokens if the database is compromised

export const hashToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
}