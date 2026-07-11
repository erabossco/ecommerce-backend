import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "@/app.js";
import { CATEGORY_ERRORS } from "@/modules/catalog/category/constants/error-messages.js";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages.js";
import { createId } from "@paralleldrive/cuid2";
import type { Category } from "@prisma/client";

describe("Category API", () => {


    const categoryEndPoint = "/api/v1/categories";

    interface Result {
        id: string;
        name: string;
        slug: string;
        description: string;
        isActive: boolean;
    }

    let result: Partial<Result> = {};
    let parentId: string = "";
    let childId: string = "";

    // ==========================
    // CREATE A NEW CATEGORY
    // ==========================

    describe("POST /categories", () => {

        const uniqueString = Date.now()
        const payload = {
            name: `test-category-${uniqueString}`,
            slug: `test-category-${uniqueString}`,
            description: "Test category items"
        };

        it("should create a category", async () => {

            const response = await request(app)
                .post(categoryEndPoint)
                .send(payload);
            result = {
                id: response.body.data.id,
                name: response.body.data.name,
                slug: response.body.data.slug,
                description: response.body.data.description,
                isActive: response.body.data.isActive,
            };
            parentId = result.id as string;

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data).toMatchObject({
                name: payload.name,
                slug: payload.slug,
                description: payload.description,
                isActive: true,
            });
        });

        // Create a child category
        it("should create a child category", async () => {
            const childCategoryData = {
                name: "test-new-child",
                slug: "test-new-child",
                parentId: result.id
            }
            const response = await request(app)
                .post(categoryEndPoint)
                .send(childCategoryData);

            // childId will be required for deleting test later
            childId = response.body.data.id;

            expect(response.status).toBe(201);
            expect(response.body.data.parentId).toBeDefined();
            expect(response.body.data).toMatchObject({
                name: childCategoryData.name,
                slug: childCategoryData.slug,
                parentId: childCategoryData.parentId,
                isActive: true,
                deletedAt: null,
            });
        });

        // Reject duplicate category name
        it("should reject duplicate category name", async () => {
            const response = await request(app)
                .post(categoryEndPoint)
                .send({
                    name: result.name!,
                    slug: "test-another-slug",
                });

            console.log(response.error)
            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(CATEGORY_ERRORS.CATEGORY_NAME_EXISTS);
        });


        // Reject duplicate category slug
        it("should reject duplicate category slug", async () => {
            const response = await request(app)
                .post(categoryEndPoint)
                .send({
                    name: "test-new-category-name",
                    slug: result.slug,
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(CATEGORY_ERRORS.CATEGORY_SLUG_EXISTS);
        });


        // Reject invalid parent category id
        it("should reject invalid parent category id", async () => {
            const response = await request(app)
                .post(categoryEndPoint)
                .send({
                    name: "test-new-name-for-category",
                    slug: "test-new-name-for-category",
                    parentId: createId(),
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(CATEGORY_ERRORS.PARENT_CATEGORY_NOT_FOUND);
        });


        // Reject invalid request body
        it("should reject invalid payload for creating a category", async () => {
            const invalidPayload = {
                name: "test-catetory-name-only"
            };

            const response = await request(app)
                .post(categoryEndPoint)
                .send(invalidPayload);

            expect(response.body.success).toBe(false)
        });

    });


    // ===========================
    // FIND BY ID 
    // ===========================

    describe("GET /categories/:id", () => {

        // find category by id
        it("should find a category by id", async () => {
            const id = result.id;
            const response = await request(app)
                .get(`${categoryEndPoint}/${id}`);

            expect(response.body.data.id).toBeDefined();
            expect(response.body.data).toMatchObject(result);
        });

        // sending invalid id will return validation error with 400
        it("should return validation error for invalid id", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}/falseid-not-like-cuid2`);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
            expect(response.body.errors[0].message).toBe(CATEGORY_ERRORS.INVALID_CATEGORY_ID);
        });

        // sending validated but non-existing id will return 404
        it("should return 404 for schema validated but non-existing id", async () => {
            const id = createId();
            const response = await request(app)
                .get(`${categoryEndPoint}/${id}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(CATEGORY_ERRORS.CATEGORY_NOT_FOUND);
            expect(response.body).not.haveOwnProperty("errors");
        });
    });


    // =========================
    // FIND ALL CATEGORIES
    // =========================

    describe("GET /categories", () => {

        // Get categories
        it("should get all categories", async () => {
            const response = await request(app)
                .get(categoryEndPoint);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        // Category pagination
        it("should paginate categories", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?page=1&limit=2`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.meta.total).toBeGreaterThanOrEqual(2);
            expect(response.body.meta.page).toBeGreaterThan(0);
        });

        // Search category by name
        it("should search category by name", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?search=test-`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
            expect(response.body.meta.page).toBeGreaterThan(0);
            response.body.data.forEach((category: Category) => {
                expect(category.name).toContain("test-");
            });
        });

        // Search category by slug
        it("should search category by name", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?search=test-`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
            expect(response.body.meta.page).toBeGreaterThan(0);
            response.body.data.forEach((category: Category) => {
                expect(category.slug).toContain("test-");
            });
        });

        // Filter category by parent category id
        it("should filter child-categories by parent category", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?parentId=${parentId}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);
            response.body.data.forEach((category: Category) => {
                expect(category.parentId).toBe(parentId);
            });
        });

        // Filter category by active status
        it("should filter category by active status", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?isActive=true`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);
            response.body.data.forEach((category: Category) => {
                expect(category.isActive).toBe(true);
            });
        });

        // Filter category by inactive status 
        it("should filter category by inactive status", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?isActive=false`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);
            response.body.data.forEach((category: Category) => {
                expect(category.isActive).toBe(false);
            });
        });

        // Sorting categories by asc
        it("should sort categories by asc", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?sortBy=name&order=asc`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);

            const names = response.body.data.map((category: Category) => category.name);
            const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
            expect(names).toEqual(sortedNames);
        });

        // Sorting categories by desc
        it("should sort categories by desc", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?sortBy=name&order=desc`)

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);

            const names = response.body.data.map((category: Category) => category.name);
            const sortedNames = [...names].sort((a, b) => b.localeCompare(a));
            expect(names).toEqual(sortedNames);
        });

        // Reject invalid page query
        it("should reject invalid page query", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?page=-1`)

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
            expect(response.body.errors[0].message).toBe(CATEGORY_ERRORS.INVALID_PAGE_NUMBER);
        });

        // Reject invalid limit
        it("should reject invalid limit", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?limit=0`);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
            expect(response.body.errors[0].message).toBe(CATEGORY_ERRORS.INVALID_CATEGORY_LIMIT);
        });

        // Reject invalid sort query
        it("should reject invalid sortBy field", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?sortBy=you`);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
            expect(response.body.errors[0].message).toBe(CATEGORY_ERRORS.INVALID_CATEGORY_SORTBY);
        });

        // Reject invalid parent id
        it("should reject invalid parent id", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?parentId=hello`);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
            expect(response.body.errors[0].message).toBe(CATEGORY_ERRORS.INVALID_PARENT_ID);
        });

        // Return empty array when no search matches
        it("should return an empty array when no search matches", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}?search=gold-computer`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual([]);
            expect(response.body.meta.total).toBe(0);
            expect(response.body.meta.totalPages).toBe(0);
        });


    });


    // =============================
    // UPDATE CATEGORY
    // =============================

    describe("PATCH /categories/:id", () => {

        it("should update a category", async () => {

            const id = result.id;
            const updatePayload = {
                name: "test-category-latest",
                slug: "test-category-latest",
                description: "latest category",
                imageUrl: "http://example.com/test-image-url-of-category",
            }

            const response = await request(app)
                .patch(`${categoryEndPoint}/${id}`)
                .send(updatePayload);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.updatedAt).toBeDefined();
            expect(response.body.data.imageUrl).toBeDefined();
            expect(response.body.data).toMatchObject(updatePayload);
            expect(response.body.data).not.toMatchObject(result);
        });

        // Reject update for non-existing id
        it("should reject updating a category with false id", async () => {
            const id = createId();
            const response = await request(app)
                .patch(`${categoryEndPoint}/${id}`)
                .send({ name: "test new category" });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(CATEGORY_ERRORS.CATEGORY_NOT_FOUND);
        });

        // Reject update for invalid catory id 
        it("should return 400 for schema not-validated id", async () => {
            const response = await request(app)
                .patch(`${categoryEndPoint}/simple-id`)
                .send({ name: "test new category name" });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
            expect(response.body.errors[0].message).toBe(CATEGORY_ERRORS.INVALID_CATEGORY_ID);
        });
    });


    // ===============================
    // DELETE A CATEGORY (SOFT DELETE)
    // =============================== 

    describe("DELETE /categories/:id", () => {

        // First delete child category, then delete main category
        // Otherwise it is not allowed to delete a category that has children

        it("should delete a child category (soft delete)", async () => {
            const id = childId;

            const response = await request(app)
                .delete(`${categoryEndPoint}/${id}`);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Category deleted successfully.");

        });

        it("should delete a category (soft delete)", async () => {
            const id = result.id;

            const response = await request(app)
                .delete(`${categoryEndPoint}/${id}`);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Category deleted successfully.");
        });

    });
});