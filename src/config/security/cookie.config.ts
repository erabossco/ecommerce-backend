import { envConfig } from "../env/index.js";
import ms from "ms";


/**
 * Cookie configuration for auth tokens
 * Includes settings for accessToken, refreshToken and cookie clearing system
 */
export const cookieConfig = {
    accessTokenCookieOptions: {
        httpOnly: true,
        secure: envConfig.app.isProduction,
        sameSite: "lax" as const,
        path: "/",
        maxAge: Number(ms(envConfig.jwt.access.expiresIn)),
    },

    refreshTokenCookieOptions: {
        httpOnly: true,
        secure: envConfig.app.isProduction,
        sameSite: "lax" as const,
        path: "/",
        maxAge: Number(ms(envConfig.jwt.refresh.expiresIn)),
    },

    clearCookieOptions: {
        httpOnly: true,
        secure: envConfig.app.isProduction,
        sameSite: "lax" as const,
        path: "/",
    }
}