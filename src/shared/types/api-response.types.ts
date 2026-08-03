// Api response types (common shared)
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: unknown;
    error?: unknown;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    previousPage: number | null;
    nextPage: number | null;
}

export interface ListResult<T> {
    data: T[];
    meta: PaginationMeta;
}