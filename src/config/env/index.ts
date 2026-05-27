import "dotenv/config";
import z from "zod";
import { envSchema } from "./env.schema.js";
import { createAppConfig } from "./app.env.js";

/**
 * Validate environment variables using the Zod schema.
 * The application exits immediately if validation fails.
 */
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    const formattedError = z.treeifyError(parsedEnv.error);
    console.error("Invalid environment variables!");
    console.error(formattedError);
    process.exit(1);
}

const env = parsedEnv.data;


/**
 * Centralized immutable application configuration.
 *
 * Object.freeze prevents accidental runtime mutation
 * of configuration values after application startup.
 */
export const envConfig = Object.freeze({
    app: createAppConfig(env),
});
