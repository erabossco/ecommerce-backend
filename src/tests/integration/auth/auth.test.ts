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

    // Test uer registeration flow
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
        refreshTokenCookie = cookies[0]!;
    });
});