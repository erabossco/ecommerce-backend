import type { Brand, Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js"

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

    // Find brand by id
    async findById(id: string): Promise<Brand | null> {
        return await prisma.brand.findUnique({
            where: {
                id,
            }
        });
    }
    // Find many brands
    async findMany(args?: Prisma.BrandFindManyArgs): Promise<Brand[]> {
        return await prisma.brand.findMany({
            ...args,
            where: {
                deletedAt: null,
                ...args?.where,
            }
        });
    }

    // Count Brands
    async count(args?: Prisma.BrandCountArgs): Promise<number> {
        return await prisma.brand.count({
            ...args,
            where: {
                deletedAt: null,
                ...args?.where,
            }
        });
    }

    // Update brand
    async update(id: string, data: Prisma.BrandUpdateInput): Promise<Brand> {
        return await prisma.brand.update({
            where: { id, },
            data,
        })
    }

    // Delete a brand (soft delete)
    async delete(id: string): Promise<Brand> {
        return await prisma.brand.update({
            where: { id },
            data: {
                isActive: false,
                deletedAt: new Date(),
            }
        });
    }

}

export const brandRepository = new BrandRepository();