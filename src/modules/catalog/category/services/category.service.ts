import { Prisma } from "@prisma/client";
import type { Category } from "@prisma/client";

import { categoryRepository } from "../repositories/category.repository.js";
import type { CategoryQuery, CreateCategoryDto, UpdateCategoryDto, } from "../types/category.types.js";

class CategoryService {

    // ====================
    // CREATE A NEW CATEGORY
    // ====================

    async create(data: CreateCategoryDto): Promise<Category> {
        const existingName = await categoryRepository.findByName(data.name);

        if (existingName) {
            throw new Error("Category name already exists.");
        }

        const existingSlug = await categoryRepository.findBySlug(data.slug);

        if (existingSlug) {
            throw new Error("Category slug already exists.");
        }

        if (data.parentId) {
            const parent = await categoryRepository.findById(data.parentId);

            if (!parent) {
                throw new Error("Parent category not found.");
            }
        }

        return await categoryRepository.create(data);
    }


    // ========================== 
    // FIND AN EXISTING CATEGORY
    // ==========================

    async findById(id: string): Promise<Category | null> {
        return await categoryRepository.findById(id);
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
                    OR: [
                        {
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
                        },
                    ],
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
            throw new Error("Category not found.");
        }

        if (data.name) {
            const existing = await categoryRepository.findByName(data.name);

            if (existing && existing.id !== id) {
                throw new Error("Category name already exists.");
            }
        }

        if (data.slug) {
            const existing = await categoryRepository.findBySlug(data.slug);

            if (existing && existing.id !== id) {
                throw new Error("Category slug already exists.");
            }
        }

        if (data.parentId) {
            const parent = await categoryRepository.findById(data.parentId);

            if (!parent) {
                throw new Error("Parent category not found.");
            }

            if (parent.id === id) {
                throw new Error("Category cannot be its own parent.");
            }
        }

        return await categoryRepository.update(id, data);
    }

    // ====================
    // DELETE A CATEGORY
    // ====================

    async delete(id: string): Promise<Category> {
        const category = await categoryRepository.findById(id);

        if (!category) {
            throw new Error("Category not found.");
        }

        return await categoryRepository.delete(id);
    }
}

export const categoryService = new CategoryService();