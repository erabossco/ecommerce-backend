import request from "supertest";

import app from "@/app.js";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";
import { SUCCESS_MESSAGES } from "@/shared/constants/success-messages.js";

const productsEndpoint = "/api/v1/products";

const uniqueString = Date.now();

let categoryId: string;
let brandId: string;
let productId: string;
let variantId: string;
let imageId: string;
let secondImageId: string;

interface Result {
    id: string;
    variantId: string;
    imageUrl: string;
    altText: string | null;
    isPrimary: boolean;
    sortOrder: number;
}

let result: Partial<Result> = {};

describe("Product Image API", async () => {

    // CREATE A CATEGORY BEFORE CREATING A PRODUCT

    const categoryApiEndPoint = "/api/v1/categories";

    const categoryPayload = {
        name: `test-category-${uniqueString}`,
        slug: `test-category-${uniqueString}`,
        description: "Test category items",
    };

    const category = await request(app)
        .post(categoryApiEndPoint)
        .send(categoryPayload);

    categoryId = category.body.data.id;


    // CREATE A BRAND BEFORE CREATING A PRODUCT

    const brandApiEndPoint = "/api/v1/brands";

    const brandPayload = {
        name: `test-brand-${uniqueString}`,
        slug: `test-brand-${uniqueString}`,
    };

    const brand = await request(app)
        .post(brandApiEndPoint)
        .send(brandPayload);

    brandId = brand.body.data.id;

    // CREATE A PRODUCT BEFORE CREATING A VARIANT

    const productApiEndPoint = "/api/v1/products";

    const productPayload = {
        name: `test-product-${uniqueString}`,
        slug: `test-product-${uniqueString}`,
        shortDescription: "Test product short description",
        description: "Test product description",
        categoryId,
        brandId,
    };

    const product = await request(app)
        .post(productApiEndPoint)
        .send(productPayload);

    productId = product.body.data.id;


    // CREATE A VARIANT BEFORE CREATING PRODUCT IMAGE

    const variantsEndpoint = `${productsEndpoint}/${productId}/variants`;

    const variant = await request(app)
        .post(variantsEndpoint)
        .send({
            sku: `test-sku-${uniqueString}`,
            price: 100,
            isDefault: true,
            isActive: true,
            trackInventory: true,
        });

    variantId = variant.body.data.id;

    // ===========================
    // PRODUCT IMAGE TESTS START
    // ===========================

    const productImageEndpoint = `${productsEndpoint}/${productId}/variants/${variantId}/images`;


    // CREATE PRODUCT IMAGES

    describe("POST /products/:productId/variants/:variantId/images", () => {

        // Create a product image

        it("should create a product image", async () => {
            const response = await request(app)
                .post(productImageEndpoint)
                .send({
                    imageUrl: `https://example.com/product-${uniqueString}-1.jpg`,
                    altText: "Test product image one",
                    sortOrder: 0,
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.variantId).toBe(variantId);

            imageId = response.body.data.id;
        });


        // Create a second product image

        it("should create a second product image", async () => {
            const response = await request(app)
                .post(productImageEndpoint)
                .send({
                    imageUrl: `https://example.com/product-${uniqueString}-2.jpg`,
                    altText: "Test product image two",
                    sortOrder: 1,
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.variantId).toBe(variantId);

            secondImageId = response.body.data.id;
        });


        // Should reject an invalid product ID

        it("should reject an invalid product ID", async () => {
            const response = await request(app)
                .post(`${productsEndpoint}/invalid-product-id/variants/${variantId}/images`)
                .send({
                    imageUrl: "https://example.com/invalid.jpg",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });


        // Should reject an invalid variant ID

        it("should reject an invalid variant ID", async () => {
            const response = await request(app)
                .post(`${productsEndpoint}/${productId}/variants/invalid-variant-id/images`)
                .send({
                    imageUrl: "https://example.com/invalid.jpg",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });


        // Should reject an invalid image URL

        it("should reject an invalid image URL", async () => {
            const response = await request(app)
                .post(productImageEndpoint)
                .send({
                    imageUrl: "invalid-url",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });


    // GET ALL IMAGES BY VARIANT

    describe("GET /products/:productId/variants/:variantId/images", () => {

        // Get all images belonging to the variant

        it("should return all images belonging to the variant", async () => {
            const response = await request(app)
                .get(productImageEndpoint);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
        });
    });


    // GET IMAGE BY ID

    describe("GET /products/:productId/variants/:variantId/images/:imageId", () => {

        // Get image by ID

        it("should return an image by ID", async () => {
            const response = await request(app)
                .get(`${productImageEndpoint}/${imageId}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(imageId);
            expect(response.body.data.variantId).toBe(variantId);
        });


        // Return not found for non-existing image

        it("should return 404 for a non-existing image ID", async () => {
            const response = await request(app)
                .get(`${productImageEndpoint}/cmabcdefghijklmnoptuvwxn`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });


        // Should reject an invalid image ID

        it("should reject an invalid image ID", async () => {
            const response = await request(app)
                .get(`${productImageEndpoint}/invalid-image-id`);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });


    // UPDATE PRODUCT IMAGE

    describe("PATCH /products/:productId/variants/:variantId/images/:imageId", () => {

        // Update an image

        it("should update a product image", async () => {
            const response = await request(app)
                .patch(`${productImageEndpoint}/${imageId}`)
                .send({
                    altText: "Updated product image",
                    sortOrder: 2,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(imageId);
            expect(response.body.data.sortOrder).toBe(2);
        });


        // Set the second image as primary

        it("should set the second image as primary", async () => {
            const response = await request(app)
                .patch(`${productImageEndpoint}/${secondImageId}`)
                .send({
                    isPrimary: true,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.isPrimary).toBe(true);

            const images = await prisma.productImage.findMany({
                where: { variantId },
            });

            expect(images.filter((image) => image.isPrimary)).toHaveLength(1);

            const previousImage = images.find(
                (image) => image.id === imageId
            );

            expect(previousImage?.isPrimary).toBe(false);
        });
    });


    // DELETE PRODUCT IMAGE

    describe("DELETE /products/:productId/variants/:variantId/images/:imageId", () => {

        // Delete a product image

        it("should delete a product image", async () => {
            const response = await request(app)
                .delete(`${productImageEndpoint}/${secondImageId}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(SUCCESS_MESSAGES.DELETED);
        });


        // Verify deleted image

        it("should return 404 for a deleted image", async () => {
            const response = await request(app)
                .get(`${productImageEndpoint}/${secondImageId}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });
});