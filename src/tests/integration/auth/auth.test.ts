import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@/app.js";

describe("Auth API", () => {


    // Store tokens for later auth tests
    let accessToken = "";
    let refreshTokenCookie = "";


    // Unique user email with Date.now() per run test
    const testUser = {
        firstName: "Mamun",
        lastName: "Hossain",
        email: `test-${Date.now()}@example.com`,
        password: "Password123"
    };

    // ============================
    // TEST USER REGISTRATION FLOW
    // =============================

    it("should register a user", async () => {
        const response = await request(app)
            .post("/api/v1/auth/register")
            .send(testUser);

        expect(response.status).toBe(201);
        expect(response.body.data.tokens.accessToken).toBeDefined();

        accessToken = response.body.data.tokens.accessToken;

        const cookies = response.headers["set-cookie"];
        if (!cookies?.length) {
            throw new Error("Refresh token cookie not found");
        }
        refreshTokenCookie = cookies[0]!.split(";")[0]!;
    });

    // ================
    // TEST USER LOGIN
    // ================

    it("should login user", async () => {
        const response = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.tokens.accessToken).toBeDefined();
    });


    // ==========================
    // TEST REFRESH TOKEN COOKIE
    // ==========================

    it("should refresh token", async () => {

        const response = await request(app)
            .post("/api/v1/auth/refresh")
            .set("Cookie", refreshTokenCookie);

        expect(response.status).toBe(200);
        expect(response.body.data.accessToken).toBeDefined();
        expect(response.body.data.refreshToken).toBeDefined();
        expect(response.body.data.refreshToken).not.toBe(refreshTokenCookie.split("=")[1]);
    });


    // ================================
    // TEST USER LOGOUT CURRENT DEVICE
    // ================================

    it("should logout current device", async () => {
        const response = await request(app)
            .post("/api/v1/auth/logout")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Logged out successfully");
    });

});