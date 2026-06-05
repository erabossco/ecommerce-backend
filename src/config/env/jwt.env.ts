import type { EnvSchemaType } from "./env.schema.js";
import ms from "ms";


/**
 * Create a groupwise structured JWT configuration object from validated environment variables
 * 
 * This JWT group setting includes access, refresh and options
 * @param env - validated environment variables (EnvSchemaType)
 * @returns a strong JWT configuration used for authenticaton 
 */
export const createJwtConfig = (env: EnvSchemaType) => {
    return {
        access: {
            secret: env.JWT_ACCESS_SECRET,
            expiresIn: env.JWT_ACCESS_EXPIRES_IN as ms.StringValue,
        },
        refresh: {
            secret: env.JWT_REFRESH_SECRET,
            expiresIn: env.JWT_REFRESH_EXPIRES_IN as ms.StringValue,
        },
        options: {
            issuer: env.APP_NAME,
            audience: env.CLIENT_URL,
        },
    };
}

