import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "@/app.js";

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