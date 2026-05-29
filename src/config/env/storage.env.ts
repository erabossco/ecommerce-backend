import type { EnvSchemaType } from "./env.schema.js";


/**
 * Creates storage configuration for SELF-HOSTED file storage system
 * 
 * @param env - validated environment variables containing storage settings
 * 
 * @returns storage config object containing upload directory and base url
 */
export const createStorageConfig = (env: EnvSchemaType) => ({
    uploadDir: env.UPLOAD_DIR,
    baseUrl: env.STORAGE_BASE_URL,
});


// ======================
// FOR AWS STORAGE SYSTEM
// ======================

/** 
 * IMPORTANT
 * 
 * For this AWS configuration you need to set
 * AWS env schema first in `env.schema.ts`
 * - AWS_REGION
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 * - AWS_BUCKET_NAME
 * 
 * See public documentation for other
 * STORAGE SERVICE PROVIDER
 */

/*
export const createStorageConfig = (env: EnvSchemaType) => ({
  region: env.AWS_REGION,
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  bucketName: env.AWS_BUCKET_NAME,
});

*/
