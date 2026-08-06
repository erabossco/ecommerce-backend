import { Prisma } from "@prisma/client";
import type { Category } from "@prisma/client";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "../types/category.types.js";

class CategoryRepository {

    // CREATE CATEGORY
    async create(data: Prisma.CategoryCreateInput): Promise<Category> {
        return await prisma.category.create({
            data,
        });
    }

    // FIND CATEGORY BY ID
    async findById(id: string): Promise<Category | null> {
        return await prisma.category.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
    }

    // FIND CATEGORY BY SLUG
    async findBySlug(slug: string): Promise<Category | null> {
        return await prisma.category.findFirst({
            where: {
                slug,
                deletedAt: null,
            },
        })
    }

    // FIND CATEGORY BY NAME
    async findByName(name: string): Promise<Category | null> {
        return await prisma.category.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: Prisma.QueryMode.insensitive,
                },
                deletedAt: null,
            }
        })
    }


    // FIND CATEGORIES
    async findMany(args?: Prisma.CategoryFindManyArgs): Promise<Category[]> {
        return await prisma.category.findMany({
            ...args,
            where: {
                deletedAt: null,
                ...args?.where,
            }

        });
    }

    // CHECK CHILDREDN OF CATEGORY
    async hasChildren(parentId: string): Promise<boolean> {
        const count = await prisma.category.count({
            where: {
                parentId,
                deletedAt: null,
            },
        });

        return count > 0;
    }


    // COUNT CATEGORY
    async count(args?: Prisma.CategoryCountArgs): Promise<number> {
        return await prisma.category.count({
            ...args,
            where: {
                deletedAt: null,
                ...args?.where,
            }
        });
    }

    // UPDATE A CATEGORY
    async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
        return await prisma.category.update({
            where: { id },
            data,
        });
    }


    // DELETE A CATEGORY (SOFT DELETE)
    async delete(id: string): Promise<Category> {
        return await prisma.category.update({
            where: { id },
            data: {
                isActive: false,
                deletedAt: new Date(),
            }
        });
    }

    // CHECK IF CATEGORY EXISTS
    async exists(id: string): Promise<boolean> {
        const category = await prisma.category.findUnique({
            where: { id },
            select: {
                id: true
            }
        });

        return !!category;
    }

}

export const categoryRepository = new CategoryRepository()

