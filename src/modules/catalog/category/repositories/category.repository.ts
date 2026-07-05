import { Prisma } from "@prisma/client";
import type { Category } from "@prisma/client";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "../types/category.types.js";

class CategoryRepository {

    // CREATE CATEGORY
    async create(data: CreateCategoryDto): Promise<Category> {
        return await prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                isActive: data.isActive,
                sortOrder: data.sortOrder,

                ...(data.description !== undefined && { description: data.description, }),
                ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl, }),
                ...(data.parentId !== undefined && { parentId: data.parentId, }),
                ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle, }),
                ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription, }),
            }
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
    async update(id: string, data: UpdateCategoryDto): Promise<Category> {
        return await prisma.category.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name, }),
                ...(data.slug !== undefined && { slug: data.slug, }),
                ...(data.isActive !== undefined && { isActive: data.isActive, }),
                ...(data.description !== undefined && { description: data.description, }),
                ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl, }),
                ...(data.parentId !== undefined && { parentId: data.parentId, }),
            },
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

