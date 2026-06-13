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

export type RegisterContext = {
    userAgent?: string;
    ipAddress?: string;
};

// =================
//    LOGIN
// =================

export type LoginUserPayload = {
    email: string;
    password: string;
}

export type LoginContext = {
    userAgent?: string;
    ipAddress?: string;
};

// =============
// LOGOUT
// =============

export type LogoutResponse = {
    success: boolean;
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

// ====================
// REQUEST USER
// ====================

export type RequestUser = JwtPayload;

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

    isEmailVerified: boolean;
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

// ======================
// AUTH COOKIE OPTIONS
// ======================

export type AuthCookieOptions = {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict" | "lax" | "none";
    expires: Date;
}

export type AccessCookieOptions = AuthCookieOptions & { maxAge: number };

export type RefreshCookieOptions = AuthCookieOptions & { maxAge: number };

// ========================
// EMAIL TEMPLATES
// ========================

export type AuthEmailTemplateData = {
    firstName: string;
    verificationLink?: string;
    resetPasswordLink?: string;
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


// ===========================
// CreateRefreshToken Params
// ===========================

export type CreateRefreshTokenParams = {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
};
