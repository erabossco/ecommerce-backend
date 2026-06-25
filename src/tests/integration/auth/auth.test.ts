import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@/app.js";
import { AUTH_MESSAGES } from "@/modules/auth/constants/auth.constants.js";
import { emailVerificationService } from "@/modules/auth/services/email-verification.service.js";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js"
import { BadRequestError } from "@/shared/errors/bad-request.error.js";
import { passwordResetService } from "@/modules/auth/services/password-reset.service.js";



describe("Auth API", () => {

    // Store tokens for later auth tests
    let accessToken = "";
    let refreshTokenCookie = "";
    let emailVerificationToken = "";

    const authEndPoint = "/api/v1/auth";


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
            .post(`${authEndPoint}/register`)
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

        const user = response.body.data.user;
        emailVerificationToken = await emailVerificationService.createEmailVerificationToken(user.id);
    });

    // ================
    // TEST USER LOGIN
    // ================

    it("should login user", async () => {
        const response = await request(app)
            .post(`${authEndPoint}/login`)
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
            .post(`${authEndPoint}/refresh`)
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
            .post(`${authEndPoint}/logout`)
            .set("Authorization", `Bearer ${accessToken}`);


        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ success: true, message: AUTH_MESSAGES.LOGOUT_SUCCESS });
    });


    // =======================
    // TEST LOGOUT ALL DEVICES
    // =======================

    it("should logout all devices", async () => {
        const response = await request(app)
            .post(`${authEndPoint}/logoutALL`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ success: true, message: AUTH_MESSAGES.LOGOUT_ALL_SUCCESS });
    });


    // ======================
    // TEST GET PROFILE
    // ======================

    it("should get user profile", async () => {
        const response = await request(app)
            .get(`${authEndPoint}/profile`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ success: true, data: { email: testUser.email } });
    });

    // =======================
    // TEST VERIFY EMAIL
    // =======================

    it("should verify email", async () => {
        const response = await request(app)
            .post(`${authEndPoint}/verify-email`)
            .send({ token: emailVerificationToken });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            success: true,
            message: AUTH_MESSAGES.EMAIL_VERIFIED,
        });
    });

    // =====================
    // TEST FORGOT PASSWORD
    // =====================

    it("should send password reset email", async () => {
        const response = await request(app)
            .post(`${authEndPoint}/forgot-password`)
            .send({ email: testUser.email });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            success: true,
            message: AUTH_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
        });
    });


    // =====================
    // TEST RESET PASSWORD
    // =====================

    it("should reset password", async () => {
        const user = await prisma.user.findUnique({
            where: {
                email: testUser.email
            }
        });
        if (!user) {
            throw new BadRequestError("Test user not found");
        }

        const passwordResetToken = await passwordResetService.createPasswordResetToken(user.id);

        const newPassword = "NewPass123456";

        const response = await request(app)
            .post(`${authEndPoint}/reset-password`)
            .send({
                token: passwordResetToken,
                newPassword
            });

        expect(response.status).toBe(200);

        expect(response.body).toMatchObject({
            success: true,
            message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS,
        });
    });

});