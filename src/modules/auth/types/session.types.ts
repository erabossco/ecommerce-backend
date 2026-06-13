// =====================
// Session types
// =====================
export type CreateSessionParams = {
    userId: string;
    userAgent?: string;
    ipAddress?: string;
};

export type SessionMeta = {
    sessionId: string;
    userAgent?: string;
    ipAddress?: string;
};

