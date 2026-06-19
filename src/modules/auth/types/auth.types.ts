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
    userAgent?: string | undefined;
    ipAddress?: string | undefined;
};

// =================
//    LOGIN
// =================

export type LoginUserPayload = {
    email: string;
    password: string;
}

export type LoginContext = {
    userAgent?: string | undefined;
    ipAddress?: string | undefined;
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

// Application-specific data stored inside JWT.
// This is what we need when generating new tokens.
// But jsonwebtoken has more fileds name iat (issuedAt) and exp(expires) 
// that conflict in service layer like expiresIn for this project codebase
// So, in the next block we will make those two options optional 
// and keep them out of response to avoid the confliction
export type JwtPayload = {
    userId: string;
    email: string;
    role: Role;
    sessionId: string;
}

// JWT libraries automatically add standard fields like `iat` (issued at)
// and `exp` (expiration time) when a token is created.
// Decoded tokens contain these fields, but they should not be passed again
// when generating a new token because jsonwebtoken will create new values.
// This type is used only when reading/validating an existing JWT.
// THIS IS IMPLEMENTED IN verifyRefreshToken at service layer
export interface DecodedJwtPayload extends JwtPayload {
    iat?: number;
    exp?: number;
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

// =================
// AUTH PROFILE
// ================= 

export type CurrentUserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;

    avatar: string | null;

    role: Role;
    isEmailVerified: boolean;

    createdAt: Date;
};


// ===========================
// CreateRefreshToken Params
// ===========================

export type CreateRefreshTokenParams = {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
};
