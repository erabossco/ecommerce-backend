import type { Brand, Prisma } from "@prisma/client";
import { brandRepository } from "../repositories/brand.repository.js";
import type { CreateBrandDto } from "../types/brand.types.js";

class BrandService {
    async create(data: CreateBrandDto): Promise<Brand> {

        return brandRepository.create({
            name: data.name,
            slug: data.slug,
            ...(data.description !== undefined && { description: data.description }),
            ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        });
    }
}

export const brandService = new BrandService();