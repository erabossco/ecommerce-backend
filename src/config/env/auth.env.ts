import type { EnvSchemaType } from "./env.schema.js";


// Auth env config
export const createAuthConfig = (env: EnvSchemaType) => {
    return {
        resetPasswordExpiresIn: env.RESET_PASSWORD_EXPIRES_IN,
        verifyEmailExpiresIn: env.VERIFY_EMAIL_EXPIRES_IN,
        maxSessionPerUser: env.MAX_SESSION_PER_USER,
        sessionExpiryDays: env.SESSION_EXPIRY_DAYS,
    }
}