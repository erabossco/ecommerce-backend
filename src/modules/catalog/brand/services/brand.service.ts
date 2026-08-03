import { Prisma } from "@prisma/client";
import type { Brand } from "@prisma/client";
import { brandRepository } from "../repositories/brand.repository.js";
import type { BrandList, BrandQueryDto, CreateBrandDto } from "../types/brand.types.js";
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

    // ====================
    // FIND LIST OF BRANDS
    // ====================

    async findMany(query: BrandQueryDto): Promise<BrandList> {
        const {
            page = 1,
            limit = 10,
            search,
            isActive,
            sortBy = "createdAt",
            order = "desc",
        } = query;

        const where = {
            ...(search && {
                OR: [{
                    name: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive,
                    }
                }, {
                    description: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive,
                    }
                },],
            }),
            ...(isActive !== undefined && { isActive, })
        };

        const brands = await brandRepository.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where: where,
            orderBy: { [sortBy]: order },
        });

        const total = await brandRepository.count({
            where: where,
        });

        const totalPages = Math.ceil(total / limit);

        return {
            data: brands,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasPreviousPage: page > 1,
                hasNextPage: page < totalPages,
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
            }
        }
    }
}

export const brandService = new BrandService();