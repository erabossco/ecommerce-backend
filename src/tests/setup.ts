import { beforeAll, afterAll } from "vitest";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";


// vitest setup for db connection
beforeAll(async () => {
    await prisma.$connect();
});

// vitest setup for db disconnection
afterAll(async () => {
    await prisma.$disconnect();
});
