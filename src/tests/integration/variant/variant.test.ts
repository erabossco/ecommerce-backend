import request from "supertest";

import app from "@/app.js";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";
import { SUCCESS_MESSAGES } from "@/shared/constants/success-messages.js";

const productsEndpoint = "/api/v1/products";
const globalVariantsEndpoint = `${productsEndpoint}/variants`;

const uniqueString = Date.now();
let categoryId: string;
let brandId: string;
let productId: string;
let variantId: string;
let secondVariantId: string;
let barcode: string;
const sku = `test-sku-${uniqueString}`;
const secondSku = `test-second-sku-${uniqueString}`;

interface Result {
    id: string;
    categoryId: string;
    brandId: string;
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
}
let result: Partial<Result> = {};

describe("Product Variant API", async () => {

    // CREATE A CATEGORY BEFORE CREATING A PRODUCT
    const categoryApiEndPoint = "/api/v1/categories";
    const categoryPayload = {
        name: `test-category-${uniqueString}`,
        slug: `test-category-${uniqueString}`,
        description: "Test category items"
    };

    const category = await request(app)
        .post(categoryApiEndPoint)
        .send(categoryPayload);
    categoryId = category.body.data.id;

    // CREATE A BRAND BEFORE CREATING A PRODUCT
    const brandApiEndPoint = "/api/v1/brands";
    const brandPayload = {
        name: `test- brand ${uniqueString}`,
        slug: `test-brand-${uniqueString}`,
    }

    const brand = await request(app)
        .post(brandApiEndPoint)
        .send(brandPayload);
    brandId = brand.body.data.id;

    // CREATE A PRODUCT BEFORE CREATING A VARIANT
    const productApiEndPoint = "/api/v1/products";
    const productPayload = {
        name: `test-product-${uniqueString}`,
        slug: `test-product-${uniqueString}`,
        shortDescription: "Test- product short description",
        description: "Test product description",
        categoryId,
        brandId,
    };
    const product = await request(app)
        .post(productApiEndPoint)
        .send(productPayload);

    productId = product.body.data.id;


    // =======================
    // VARIANT TESTS START
    // =======================

    // VARIANTS ENDPOINT
    const variantsEndpoint = `${productsEndpoint}/${productId}/variants`;

    describe("POST /products/:productId/variants", () => {

        // Create a variant
        it("should create a product variant", async () => {
            const response = await request(app)
                .post(variantsEndpoint)
                .send({
                    sku,
                    price: 100,
                    costPrice: 70,
                    isDefault: true,
                    isActive: true,
                    trackInventory: true,
                    weight: 1.5,
                    length: 10,
                    width: 5,
                    height: 3,
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.productId).toBe(productId);
            expect(response.body.data.isDefault).toBe(true);

            variantId = response.body.data.id;
        });

        // Should reject a duplicate SKU
        it("should reject a duplicate SKU", async () => {
            const response = await request(app)
                .post(variantsEndpoint)
                .send({ sku, price: 150 });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
        });

        // Should reject an invalid product ID
        it("should reject an invalid product ID", async () => {
            const response = await request(app)
                .post(`${productsEndpoint}/invalid-product-id/variants`)
                .send({
                    sku: `invalid-product-sku-${uniqueString}`,
                    price: 100,
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });


    // GET GLOBAL VARIANTS

    describe("GET /products/variants", () => {

        // Get all variants globally
        it("should return all variants globally", async () => {
            const response = await request(app)
                .get(globalVariantsEndpoint);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        // Get active variants globally
        it("should return active variants globally", async () => {
            const response = await request(app)
                .get(`${globalVariantsEndpoint}/active`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });


    // Get global variant by SKU
    describe("GET /products/variants/sku/:sku", () => {
        it("should find a variant by SKU", async () => {
            const response = await request(app)
                .get(`${globalVariantsEndpoint}/sku/${encodeURIComponent(sku)}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(variantId);
        });
    });

    // Get global variant by barcode
    describe("GET /products/variants/barcode/:barcode", () => {

        // Get variant by barcode
        it("should find a variant by barcode", async () => {
            barcode = `BARCODE-${uniqueString}`;

            await prisma.productVariant.update({
                where: { id: variantId },
                data: { barcode },
            });

            const response = await request(app)
                .get(`${globalVariantsEndpoint}/barcode/${encodeURIComponent(barcode)}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(variantId);
        });
    });


    // GET SINGLE-PRODUCT SPECIFIC VARIANTS

    describe("Product-specific variants", () => {

        // Get a product specific variant
        it("should return variants belonging to the product", async () => {
            const response = await request(app).get(variantsEndpoint);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        // Get product specific active variants
        it("should return active variants belonging to the product", async () => {
            const response = await request(app)
                .get(`${variantsEndpoint}/active`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        // Get the default variant
        it("should return the product's default variant", async () => {
            const response = await request(app)
                .get(`${variantsEndpoint}/default`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.isDefault).toBe(true);
        });

        // Get variant by ID
        it("should return a variant by ID scoped to the product", async () => {
            const response = await request(app)
                .get(`${variantsEndpoint}/${variantId}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(variantId);
        });

        // Return not found for non-existing variant
        it("should return 404 for a non-existing variant ID", async () => {
            const response = await request(app).get(
                `${variantsEndpoint}/cmabcdefghijklmnoptuvwxn`,
            );

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });


    // UPDATE VARIANTS 

    describe("PATCH /products/:productId/variants/:id", () => {

        // Update a variant
        it("should update a variant", async () => {
            const response = await request(app)
                .patch(`${variantsEndpoint}/${variantId}`)
                .send({
                    price: 200,
                    costPrice: 120,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Number(response.body.data.price)).toBe(200);
        });
    });


    // CREATE SECOND VARIANT

    describe("Variant default and activation operations", () => {

        // Create a second variant
        it("should create a second variant", async () => {
            const response = await request(app)
                .post(variantsEndpoint)
                .send({
                    sku: secondSku,
                    price: 250,
                    isDefault: false,
                    isActive: true,
                    trackInventory: true,
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);

            secondVariantId = response.body.data.id;
        });

        // Set second variant as default
        it("should set the second variant as default", async () => {
            const response = await request(app).patch(
                `${variantsEndpoint}/${secondVariantId}/default`,
            );

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.isDefault).toBe(true);

            const previous = await prisma.productVariant.findUnique({
                where: { id: variantId },
            });

            expect(previous?.isDefault).toBe(false);
        });


        // Unset second variant from default
        it("should unset the second variant as default", async () => {
            const response = await request(app).patch(
                `${variantsEndpoint}/${secondVariantId}/default/remove`,
            );

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.isDefault).toBe(false);
        });


        // Deactivate second variant
        it("should deactivate the second variant", async () => {
            const response = await request(app).patch(
                `${variantsEndpoint}/${secondVariantId}/deactivate`,
            );

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.isActive).toBe(false);
        });

        // Activate the second variant
        it("should activate the second variant", async () => {
            const response = await request(app).patch(
                `${variantsEndpoint}/${secondVariantId}/activate`,
            );

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.isActive).toBe(true);
        });
    });

    // Count product variants
    describe("Product variant counts", () => {
        it("should return the count for the product", async () => {
            const response = await request(app)
                .get(`${variantsEndpoint}/count`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(typeof response.body.data.count).toBe("number");
        });
    });


    // DELETE AND RESTORE PRODUCTS

    describe("DELETE and restore product variant", () => {

        // Delete a product variant
        it("should soft-delete the second variant", async () => {
            const response = await request(app).delete(
                `${variantsEndpoint}/${secondVariantId}`,
            );

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(SUCCESS_MESSAGES.DELETED);
        });

        // Restore a soft-deleted product variant
        it("should restore the second variant", async () => {
            const response = await request(app).patch(`${variantsEndpoint}/${secondVariantId}/restore`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.deletedAt).toBeNull();
        });
    });
});
