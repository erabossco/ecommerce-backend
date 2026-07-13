import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "@/app.js";
import { BRAND_MESSAGES } from "@/modules/catalog/brand/constants/brand.constants.js";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages.js";
import { BRAND_ERRORS } from "@/modules/catalog/brand/errors/brand-errors.js";




describe("BRAND API", () => {

    const apiEndPoint = "/api/v1/brands"
    interface Result {
        id: string;
        name: string;
        slug: string;
        description: string;
    }

    let result: Partial<Result> = {};

    // =====================
    // CREATE A NEW BRAND
    // =====================

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

        // Duplicate brand name will throw conflict error 409
        it("should reject a duplicate brand name", async () => {

            const payload = {
                name: result.name,
                slug: "test-new-slug",
            }
            const response = await request(app)
                .post(apiEndPoint)
                .send(payload)

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(BRAND_ERRORS.BRAND_NAME_EXISTS);
        });

        // Duplicate slug will throw conflict error 409
        it("should reject a duplicate brand slug", async () => {
            const payload = {
                name: "test-new-brand-name",
                slug: result.slug,
            }

            const response = await request(app)
                .post(apiEndPoint)
                .send(payload);

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(BRAND_ERRORS.BRAND_SLUG_EXISTS);
        });

        // Invalid brand name will throw validation error 400
        it("should reject invalid brand name", async () => {
            const payload = {
                name: 123,
                slug: "test-slug"
            };

            const response = await request(app)
                .post(apiEndPoint)
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
            expect(response.body.errors[0].message).toBe(BRAND_ERRORS.INVALID_BRAND_NAME);
        });

        // Invalid brand name length will throw validation error 400
        it("should reject invalid brand name length", async () => {
            const payload = {
                name: "a",
                slug: "test-slug"
            };

            const response = await request(app)
                .post(apiEndPoint)
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
            expect(response.body.errors[0].message).toBe(BRAND_ERRORS.INVALID_NAME_LIMIT);
        });

        // Reject if brand name exceeds maximum length, and throw validation error 400
        it("should reject when brand name exceeds maximum length", async () => {
            const payload = {
                name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                slug: "test-slug"
            };

            const response = await request(app)
                .post(apiEndPoint)
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
            expect(response.body.errors[0].message).toBe(BRAND_ERRORS.INVALID_NAME_LIMIT);
        });

        // Invalid slug will throw validation error 400
        it("should reject invalid brand slug", async () => {
            const payload = {
                name: "test-brand-name-4",
                slug: 123
            };

            const response = await request(app)
                .post(apiEndPoint)
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
            expect(response.body.errors[0].message).toBe(BRAND_ERRORS.INVALID_BRAND_SLUG);
        });

        // Invalid slug length will throw validation error 400
        it("should reject invalid brand slug limit", async () => {
            const payload = {
                name: "test-brand-name-6",
                slug: "t"
            };

            const response = await request(app)
                .post(apiEndPoint)
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
            expect(response.body.errors[0].message).toBe(BRAND_ERRORS.INVALID_SLUG_LIMIT);
        });

        // Reject if brand slug exceeds maximum length, and throw validation error 400
        it("should reject when brand slug exceeds maximum length", async () => {
            const payload = {
                name: "test-brand-name-6",
                slug: "test-slugggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg"
            };

            const response = await request(app)
                .post(apiEndPoint)
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
            expect(response.body.errors[0].message).toBe(BRAND_ERRORS.INVALID_SLUG_LIMIT);
        });

    });


});
