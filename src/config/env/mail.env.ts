import type { EnvSchemaType } from "./env.schema.js";


/**
 * Creates mail configuration
 * 
 * @param env - validated environment variables for mail (SMTP)
 * 
 * @returns mail configuration object used for email sending setup
 */
export const createMailConfig = (env: EnvSchemaType) => ({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    user: env.MAIL_USER,
    pass: env.MAIL_PASSWORD,
    from: env.MAIL_FROM,
});