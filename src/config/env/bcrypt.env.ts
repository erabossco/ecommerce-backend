import type { EnvSchemaType } from "./env.schema.js"

// Bcrypt env config

export const createBcryptConfig = (env: EnvSchemaType) => {
    return {
        salt: env.BCRYPT_SALT_ROUNDS,
    };
}