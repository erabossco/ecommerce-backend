import { envConfig } from "../env/index.js";


/**
 * Cookie configuration for auth tokens
 * Includes settings for accessToken, refreshToken and cookie clearing system
 */
export const cookieConfig = {
    accessToken: {
        httpOnly: true,
        secure: envConfig.app.isProduction,
        sameSite: "lax" as const,
        path: "/",
        maxAge: envConfig.jwt.access.expiresIn,
    },

    refreshToken: {
        httpOnly: true,
        secure: envConfig.app.isProduction,
        sameSite: "lax" as const,
        path: "/",
        maxAge: envConfig.jwt.refresh.expiresIn,
    },

    clearCookieOptions: {
        httpOnly: true,
        secure: envConfig.app.isProduction,
        sameSite: "lax" as const,
        path: "/",
    }
}