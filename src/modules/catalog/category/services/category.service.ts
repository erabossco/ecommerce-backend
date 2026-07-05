import { Prisma } from "@prisma/client";
import type { Category } from "@prisma/client";

import { categoryRepository } from "../repositories/category.repository.js";
import type { CategoryQuery, CreateCategoryDto, UpdateCategoryDto, } from "../types/category.types.js";
import { ConflictError, NotFoundError, BadRequestError } from "@/shared/errors/index.js";
import { ERROR_MESSAGES } from "@/shared/constants/error-message.js";

class CategoryService {

    // ====================
    // CREATE A NEW CATEGORY
    // ====================

    async create(data: CreateCategoryDto): Promise<Category> {
        const existingName = await categoryRepository.findByName(data.name);

        if (existingName) {
            throw new ConflictError(ERROR_MESSAGES.CATEGORY_NAME_EXISTS);
        }

        const existingSlug = await categoryRepository.findBySlug(data.slug);

        if (existingSlug) {
            throw new ConflictError(ERROR_MESSAGES.CATEGORY_SLUG_EXISTS);
        }

        if (data.parentId) {
            const parent = await categoryRepository.findById(data.parentId);

            if (!parent) {
                throw new NotFoundError(ERROR_MESSAGES.PARENT_CATEGORY_NOT_FOUND);
            }
            if (parent.deletedAt) {
                throw new BadRequestError(ERROR_MESSAGES.PARENT_CATEGORY_DELETED)
            }
        }

        return categoryRepository.create(data);
    }


    // ========================== 
    // FIND AN EXISTING CATEGORY
    // ==========================

    async findById(id: string): Promise<Category> {
        const category = await categoryRepository.findById(id);
        if (!category) {
            throw new NotFoundError(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
        }
        return category;
    }

    // =========================
    // FIND LIST OF CATEGORIES
    // =========================

    async findMany(query: CategoryQuery): Promise<Category[]> {
        const {
            page = 1,
            limit = 10,
            search,
            parentId,
            isActive,
            sortBy = "createdAt",
            order = "desc",
        } = query;

        return await categoryRepository.findMany({
            skip: (page - 1) * limit,
            take: limit,

            where: {
                ...(search && {
                    OR: [{
                        name: {
                            contains: search,
                            mode: Prisma.QueryMode.insensitive,
                        },
                    },
                    {
                        description: {
                            contains: search,
                            mode: Prisma.QueryMode.insensitive,
                        },
                    },],
                }),

                ...(parentId !== undefined && { parentId, }),
                ...(isActive !== undefined && { isActive, }),
            },

            orderBy: { [sortBy]: order, },
        });
    }

    // ====================
    // UPDATE A CATEGORY
    // ====================

    async update(id: string, data: UpdateCategoryDto,): Promise<Category> {
        const category = await categoryRepository.findById(id);

        if (!category) {
            throw new NotFoundError(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
        }

        if (data.name) {
            const existing = await categoryRepository.findByName(data.name);

            if (existing && existing.id !== id) {
                throw new ConflictError(ERROR_MESSAGES.CATEGORY_NAME_EXISTS);
            }
        }

        if (data.slug) {
            const existing = await categoryRepository.findBySlug(data.slug);

            if (existing && existing.id !== id) {
                throw new ConflictError(ERROR_MESSAGES.CATEGORY_SLUG_EXISTS);
            }
        }

        if (data.parentId !== undefined) {
            if (data.parentId !== null) {
                const parent = await categoryRepository.findById(data.parentId);

                if (!parent) {
                    throw new NotFoundError(ERROR_MESSAGES.PARENT_CATEGORY_NOT_FOUND);
                }

                if (parent.id === id) {
                    throw new BadRequestError(ERROR_MESSAGES.CATEGORY_SELF_PARENT);
                }
            }
        }

        return categoryRepository.update(id, data);
    }

    // ====================
    // DELETE A CATEGORY
    // ====================

    async delete(id: string): Promise<Category> {
        const category = await categoryRepository.findById(id);

        if (!category) {
            throw new NotFoundError(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
        }

        const children = await categoryRepository.hasChildren(id);
        if (children) {
            throw new ConflictError(ERROR_MESSAGES.CATEGORY_HAS_CHILDREN);
        }

        return categoryRepository.delete(id);
    }
}

export const categoryService = new CategoryService();