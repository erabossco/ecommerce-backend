import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "@/app.js";
import { BRAND_MESSAGES } from "@/modules/catalog/brand/constants/brand.constants.js";


// =====================
// TEST: CREATE A BRAND
// =====================

describe("BRAND API", () => {

    const apiEndPoint = "/api/v1/brands"
    interface Result {
        id: string;
        name: string;
        slug: string;
        description: string;
    }

    let result: Partial<Result> = {};

    // CREATE A NEW BRAND
    describe("POST /brands", () => {
        it("should create a new brand", async () => {
            const payload = {
                name: "test- brand eraboss",
                slug: "test-brand-eraboss",
            }
            const response = await request(app)
                .post(apiEndPoint)
                .send(payload);
            result = response.body.data;

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(BRAND_MESSAGES.BRAND_CREATED);
            expect(response.body.data.name).toBe(payload.name);
            expect(response.body.data.slug).toBe(payload.slug);
            expect(response.body.data.isActive).toBe(true);
        });


    });


});
