import { beforeAll, afterAll } from "vitest";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";

// vitest setup for db connection
beforeAll(async () => {
    await prisma.$connect();
});

// ===================
// AFTER ALL TEST DONE
// ===================

/**
 * Delete all test data and 
 * disconnect database.
 */

afterAll(async () => {
    await prisma.user.deleteMany({
        where: {
            email: {
                startsWith: "test-"
            },
        }
    });

    await prisma.$disconnect();
});
