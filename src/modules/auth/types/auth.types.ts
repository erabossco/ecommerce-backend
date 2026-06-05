import { Role, AuthProvider } from "@prisma/client";

// ================
// REGISTER
// ================

export type RegisterUserPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

// =================
//    LOGIN
// =================

export type LoginUserPayload = {
    email: string;
    password: string;
}

// ==============
// REFRESH TOKEN
// ==============

export type RefreshTokenPayload = {
    refreshToken: string;
}

// ===============
// FORGOT PASSWORD
// ===============

export type ForgotPasswordPayload = {
    email: string;
}

// ================
//  RESET PASSWORD
// ================

export type ResetPasswordPayload = {
    token: string;
    newPassword: string;
}

// ==================
// CHANGE PASSWORD
// ==================

export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
}

// ==============
// VERIFY EMAIL
// ==============

export type VerifyEmailPayload = {
    token: string;
}

// ==============
// JWT PAYLOAD
// ==============

export type JwtPayload = {
    userId: string;
    email: string;
    role: Role;
    sessionId: string;
}

// ==========================
//  AUTH TOKEN
// ==========================

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
}

// =======================
// AUTH USER WITHOUT PASSWORD
// =======================

export type AuthUser = {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
    provider: AuthProvider;

    isVerifiedEmail: boolean;
    isActive: boolean;
    isDeleted: boolean;

    avatar: string | null;

    createdAt: Date;
    updatedAt: Date;
}

// ===============
// AUTH RESPONSE
// ===============

export type AuthResponse = {
    user: AuthUser;
    tokens: AuthTokens;
}

// ====================
// REQUEST USER
// ====================

export type RequestUser = {
    userId: string;
    email: string;
    role: Role;
}

// ================
// TOKEN TYPES (UNION TYPE)
// ================

export type TokenType =
    | "ACCESS_TOKEN"
    | "REFRESH_TOKEN"
    | "RESET_PASSWORD_TOKEN"
    | "VERIFY_EMAIL_TOKEN";

// ===================
// AUTH PROVIDER TYPE
// ===================

export type AuthProviderType =
    | "GOOGLE"
    | "FACEBOOK"
    | "EMAIL";

// ======================
// AUTH COOKIE OPTIONS
// ======================

export type AuthCookeOptions = {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict" | "lax" | "none";
    expires: Date;
}

// ========================
// EMAIL TEMPLATES
// ========================

export type AuthEmailTemplateData = {
    firstName: string;
    verificationLink?: string;
    resetPasswordLink?: string;
}

// ================
// LOGIN RESULT
// ================

export type LoginResult = {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}

// ====================
// REGISTER RESULT
// ====================

export type RegisterResult = {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}

// =================
// OAUTH PROFILE
// =================

export type OAuthProfile = {
    providerId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
}
