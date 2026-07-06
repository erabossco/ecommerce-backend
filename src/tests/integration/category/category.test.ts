import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "@/app.js";
import { ERROR_MESSAGES } from "@/shared/constants/error-message.js";
import { createId } from "@paralleldrive/cuid2";

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
                    name: result.name,
                    slug: "test-another-slug",
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.CATEGORY_NAME_EXISTS);
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
            expect(response.body.message).toBe(ERROR_MESSAGES.CATEGORY_SLUG_EXISTS);
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
            expect(response.body.message).toBe(ERROR_MESSAGES.PARENT_CATEGORY_NOT_FOUND);
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

        it("should find a category by id", async () => {
            const id = result.id;
            const response = await request(app)
                .get(`${categoryEndPoint}/${id}`);

            expect(response.body.data.id).toBeDefined();
            expect(response.body.data).toMatchObject(result);
        });

        // sending false id will return 404
        it("should return 404 for non existing category", async () => {
            const response = await request(app)
                .get(`${categoryEndPoint}/falseid`)

            expect(response.status).toBe(404);
        });
    });


    // =========================
    // FIND ALL CATEGORIES
    // =========================

    describe("GET /categories", () => {
        it("should get all categories", async () => {
            const response = await request(app)
                .get(categoryEndPoint);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
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