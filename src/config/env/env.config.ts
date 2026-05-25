import "dotenv/config";
import {z} from "zod";

const envSchema = z.object({
PORT: z.coerce.number().default(5000),
FRONTEND_URL:z.string().min(1),
});

export const envConfig = envSchema.parse(process.env);

export const frontendUrls = 
envConfig.FRONTEND_URL.split(",")
.map((url: string)=>url.trim());

export const port = envConfig.PORT;