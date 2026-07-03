import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "@/app.js";

const categoryEndPoint = "/api/v1/categories";

describe("Category test", () => {

    // Create a category
    it("should create a category", async () => {
        const payload = {
            name: `test-category-${Date.now()}`,
            slug: "test-slug",
            description: "Test category items"
        }
        const response = await request(app)
            .post(categoryEndPoint)
            .send(payload);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data).toMatchObject({
            name: payload.name,
            slug: payload.slug,
            description: payload.description,
            isActive: true,

        })
    });


});