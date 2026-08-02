import type { Brand, Prisma } from "@prisma/client";
import { brandRepository } from "../repositories/brand.repository.js";
import type { CreateBrandDto } from "../types/brand.types.js";
import { ConflictError } from "@/shared/errors/conflict.error.js";
import { BRAND_ERRORS } from "../errors/brand-errors.js";
import { NotFoundError } from "@/shared/errors/not-found.error.js";

class BrandService {

    // =====================
    // CREATE A BRAND
    // =====================

    async create(data: CreateBrandDto): Promise<Brand> {

        const brandNameExists = await brandRepository.findByName(data.name);
        if (brandNameExists) {
            throw new ConflictError(BRAND_ERRORS.BRAND_NAME_EXISTS);
        }

        const brandSlugExists = await brandRepository.findBySlug(data.slug);
        if (brandSlugExists) {
            throw new ConflictError(BRAND_ERRORS.BRAND_SLUG_EXISTS);
        }

        return brandRepository.create({
            name: data.name,
            slug: data.slug,
            ...(data.description !== undefined && { description: data.description }),
            ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        });
    }

    // ================
    // FIND BRAND BY ID
    // ================

    async findById(id: string): Promise<Brand> {
        const brand = await brandRepository.findById(id);
        if (!brand) throw new NotFoundError(BRAND_ERRORS.BRAND_NOT_FOUND);
        return brand;
    }
}

export const brandService = new BrandService();