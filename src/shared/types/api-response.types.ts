// Api response types (common shared)
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: unknown;
    error?: unknown;
}