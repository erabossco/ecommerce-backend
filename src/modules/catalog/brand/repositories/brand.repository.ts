import type { Brand, Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js"
import type { CreateBrandDto } from "../types/brand.types.js";

class BrandRepository {

    // Create brand
    async create(data: Prisma.BrandCreateInput): Promise<Brand> {
        return await prisma.brand.create({
            data,
        });
    }

    // Find brand by name
    async findByName(name: string): Promise<Brand | null> {
        return await prisma.brand.findUnique({
            where: {
                name,
            },
        });
    }

    // Find brand by slug
    async findBySlug(slug: string): Promise<Brand | null> {
        return await prisma.brand.findUnique({
            where: {
                slug,
            }
        });
    }
}

export const brandRepository = new BrandRepository();