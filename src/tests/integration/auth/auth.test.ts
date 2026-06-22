import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@/app.js";
import { AUTH_MESSAGES } from "@/modules/auth/constants/auth.constants.js";

describe("Auth API", () => {

    // Store tokens for later auth tests
    let accessToken = "";
    let refreshTokenCookie = "";


    // Unique user email with Date.now() per run test
    // `AfterAll` setup will delete all test data when completes the test
    // based on email starts with `test-`
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
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(AUTH_MESSAGES.REGISTER_SUCCESS)

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
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(AUTH_MESSAGES.LOGIN_SUCCESS);
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
        expect(response.body).toMatchObject({ success: true, message: AUTH_MESSAGES.TOKEN_REFRESHED });
    });


    // ================================
    // TEST USER LOGOUT CURRENT DEVICE
    // ================================

    it("should logout current device", async () => {
        const response = await request(app)
            .post("/api/v1/auth/logout")
            .set("Authorization", `Bearer ${accessToken}`);


        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ success: true, message: AUTH_MESSAGES.LOGOUT_SUCCESS });
    });


    // =======================
    // TEST LOGOUT ALL DEVICES
    // =======================

    it("should logout all devices", async () => {
        const response = await request(app)
            .post("/api/v1/auth/logoutALL")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ success: true, message: AUTH_MESSAGES.LOGOUT_ALL_SUCCESS });
    });


    // ======================
    // TEST GET PROFILE
    // ======================

    it("should get user profile", async () => {
        const response = await request(app)
            .get("/api/v1/auth/profile")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ success: true, data: { email: testUser.email } });
    });

});