import type { Brand, Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js"

class BrandRepository {
    async create(data: Prisma.BrandCreateInput): Promise<Brand> {
        return await prisma.brand.create({
            data,
        });
    }
}

export const brandRepository = new BrandRepository();