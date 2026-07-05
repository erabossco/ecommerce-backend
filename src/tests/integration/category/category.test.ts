import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "@/app.js";
import { ERROR_MESSAGES } from "@/shared/constants/error-message.js";

const categoryEndPoint = "/api/v1/categories";

interface Result {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}

let result: Partial<Result> = {};

// ==========================
// CREATE A NEW CATEGORY
// ==========================

describe("POST /categories", () => {

    const payload = {
        name: `test-category-${Date.now()}`,
        slug: "test-slug",
        description: "Test category items"
    };

    it("should create a category", async () => {

        const response = await request(app)
            .post(categoryEndPoint)
            .send(payload);
        result = {
            id: response.body.data.id,
            name: response.body.data.name,
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

    it("should delete a category (soft delete)", async () => {
        const id = result.id;

        const response = await request(app)
            .delete(`${categoryEndPoint}/${id}`);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Category deleted successfully.");

    });

})