import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { ADDRESS_MESSAGES } from "@/modules/address/constants/address.constants.js";
import app from "@/app.js";


const authEndpoint = "/api/v1/auth";
const addressesEndpoint = "/api/v1/addresses";

const uniqueString = Date.now();

let accessToken = "";
let anotherAccessToken = "";

let addressId = "";
let secondAddressId = "";

const testUser = {
    firstName: "Address",
    lastName: "Tester",
    email: `test-address-${uniqueString}@example.com`,
    password: "Password123",
};

const anotherTestUser = {
    firstName: "Another",
    lastName: "AddressTester",
    email: `test-address-other-${uniqueString}@example.com`,
    password: "Password123",
};


// ============================
// TEST DATA
// ============================

const addressData = {
    fullName: "Address Test User",
    phone: "01712345678",
    addressLine1: "House 10, Road 5",
    addressLine2: "Apartment 3B",
    city: "Dhaka",
    state: "Dhaka",
    postalCode: "1205",
    country: "Bangladesh",
    addressType: "HOME" as const,
    isDefaultShipping: true,
    isDefaultBilling: true,
};


// ============================
// ADDRESS TEST SETUP
// ============================

// REGISTER A TEST USER

const user = await request(app)
    .post(`${authEndpoint}/register`)
    .send(testUser);

expect(user.status).toBe(201);

accessToken = user.body.data.tokens.accessToken;


// REGISTER ANOTHER TEST USER

const anotherUser = await request(app)
    .post(`${authEndpoint}/register`)
    .send(anotherTestUser);

expect(anotherUser.status).toBe(201);

anotherAccessToken = anotherUser.body.data.tokens.accessToken;


// ============================
// ADDRESS API TESTS
// ============================

describe("Address API", () => {

    // ============================
    // AUTHENTICATION
    // ============================

    describe("Authentication", () => {

        it("should reject an unauthenticated request", async () => {
            const response = await request(app)
                .get(addressesEndpoint);

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });


        it("should reject an invalid access token", async () => {
            const response = await request(app)
                .get(addressesEndpoint)
                .set("Authorization", "Bearer invalid-token");

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

    });


    // ============================
    // GET ALL ADDRESSES
    // ============================

    describe("GET /addresses", () => {

        it("should return an empty address list initially", async () => {
            const response = await request(app)
                .get(addressesEndpoint)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(ADDRESS_MESSAGES.ADDRESSES_FETCHED);
            expect(response.body.data).toEqual([]);
        });

    });


    // ============================
    // CREATE ADDRESS
    // ============================

    describe("POST /addresses", () => {

        it("should create an address", async () => {
            const response = await request(app)
                .post(addressesEndpoint)
                .set("Authorization", `Bearer ${accessToken}`)
                .send(addressData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(ADDRESS_MESSAGES.ADDRESS_CREATED);

            expect(response.body.data).toHaveProperty("id");
            expect(response.body.data.fullName).toBe(addressData.fullName);
            expect(response.body.data.phone).toBe(addressData.phone);
            expect(response.body.data.addressLine1).toBe(addressData.addressLine1);
            expect(response.body.data.city).toBe(addressData.city);
            expect(response.body.data.country).toBe(addressData.country);

            expect(response.body.data.isDefaultShipping).toBe(true);
            expect(response.body.data.isDefaultBilling).toBe(true);

            addressId = response.body.data.id;
        });


        it("should reject an empty request body", async () => {
            const response = await request(app)
                .post(addressesEndpoint)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });


        it("should reject an invalid phone number", async () => {
            const response = await request(app)
                .post(addressesEndpoint)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    ...addressData,
                    phone: "",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });


        it("should reject an invalid address type", async () => {
            const response = await request(app)
                .post(addressesEndpoint)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    ...addressData,
                    addressType: "INVALID",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });


        it("should create another address and clear the previous default shipping address", async () => {
            const response = await request(app)
                .post(addressesEndpoint)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    ...addressData,
                    fullName: "Second Address User",
                    addressLine1: "House 20, Road 10",
                    isDefaultShipping: true,
                    isDefaultBilling: false,
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);

            expect(response.body.data.isDefaultShipping).toBe(true);
            expect(response.body.data.isDefaultBilling).toBe(false);

            secondAddressId = response.body.data.id;

            const firstAddress = await request(app)
                .get(`${addressesEndpoint}/${addressId}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(firstAddress.status).toBe(200);
            expect(firstAddress.body.data.isDefaultShipping).toBe(false);
            expect(firstAddress.body.data.isDefaultBilling).toBe(true);
        });

    });


    // ============================
    // GET ADDRESS BY ID
    // ============================

    describe("GET /addresses/:addressId", () => {

        it("should return an address by ID", async () => {
            const response = await request(app)
                .get(`${addressesEndpoint}/${addressId}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(ADDRESS_MESSAGES.ADDRESS_FETCHED);

            expect(response.body.data.id).toBe(addressId);
            expect(response.body.data.fullName).toBe(addressData.fullName);
        });


        it("should reject an invalid address ID", async () => {
            const response = await request(app)
                .get(`${addressesEndpoint}/invalid-address-id`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });


        it("should return 404 for a non-existing address", async () => {
            const nonExistingAddressId = `c${"a".repeat(23)}`;

            const response = await request(app)
                .get(`${addressesEndpoint}/${nonExistingAddressId}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });


        it("should not allow another user to access the address", async () => {
            const response = await request(app)
                .get(`${addressesEndpoint}/${addressId}`)
                .set("Authorization", `Bearer ${anotherAccessToken}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });


        it("should return all addresses belonging to the authenticated user", async () => {
            const response = await request(app)
                .get(addressesEndpoint)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(ADDRESS_MESSAGES.ADDRESSES_FETCHED);

            expect(response.body.data).toHaveLength(2);
        });

    });


    // ============================
    // UPDATE ADDRESS
    // ============================

    describe("PATCH /addresses/:addressId", () => {

        it("should update address details", async () => {
            const response = await request(app)
                .patch(`${addressesEndpoint}/${addressId}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    fullName: "Updated Address User",
                    phone: "01812345678",
                    addressLine1: "House 30, Road 15",
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(ADDRESS_MESSAGES.ADDRESS_UPDATED);

            expect(response.body.data.id).toBe(addressId);
            expect(response.body.data.fullName).toBe("Updated Address User");
            expect(response.body.data.phone).toBe("01812345678");
            expect(response.body.data.addressLine1).toBe("House 30, Road 15");
        });


        it("should update the default billing address", async () => {
            const response = await request(app)
                .patch(`${addressesEndpoint}/${secondAddressId}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    isDefaultBilling: true,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.isDefaultBilling).toBe(true);

            const firstAddress = await request(app)
                .get(`${addressesEndpoint}/${addressId}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(firstAddress.status).toBe(200);
            expect(firstAddress.body.data.isDefaultBilling).toBe(false);
        });


        it("should reject an invalid address ID", async () => {
            const response = await request(app)
                .patch(`${addressesEndpoint}/invalid-address-id`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    fullName: "Updated Name",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });


        it("should reject an invalid request body", async () => {
            const response = await request(app)
                .patch(`${addressesEndpoint}/${addressId}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    phone: "",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });


        it("should return 404 for a non-existing address", async () => {
            const nonExistingAddressId = `c${"a".repeat(23)}`;

            const response = await request(app)
                .patch(`${addressesEndpoint}/${nonExistingAddressId}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    fullName: "Updated Name",
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });


        it("should not allow another user to update the address", async () => {
            const response = await request(app)
                .patch(`${addressesEndpoint}/${addressId}`)
                .set("Authorization", `Bearer ${anotherAccessToken}`)
                .send({
                    fullName: "Unauthorized Update",
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });

    });


    // ============================
    // DELETE ADDRESS
    // ============================

    describe("DELETE /addresses/:addressId", () => {

        it("should delete an address", async () => {
            const response = await request(app)
                .delete(`${addressesEndpoint}/${secondAddressId}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(ADDRESS_MESSAGES.ADDRESS_DELETED);
        });


        it("should return 404 when accessing the deleted address", async () => {
            const response = await request(app)
                .get(`${addressesEndpoint}/${secondAddressId}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });


        it("should return 404 when deleting a non-existing address", async () => {
            const nonExistingAddressId = `c${"a".repeat(23)}`;

            const response = await request(app)
                .delete(`${addressesEndpoint}/${nonExistingAddressId}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });


        it("should not allow another user to delete the address", async () => {
            const response = await request(app)
                .delete(`${addressesEndpoint}/${addressId}`)
                .set("Authorization", `Bearer ${anotherAccessToken}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });

    });

});