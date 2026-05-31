import type { EnvSchemaType } from "./env.schema.js"

// Bcrypt env config

export const createBcryptConfig = (env: EnvSchemaType) => {
    return {
        saltRounds: env.BCRYPT_SALT_ROUNDS,
    };
}