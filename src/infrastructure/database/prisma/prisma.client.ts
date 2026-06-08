// Prisma database client setup

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { envConfig } from '@/config/env/index.js';


const connectionString = envConfig.database.url;
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });