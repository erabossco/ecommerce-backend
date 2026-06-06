// Pagination utils (shared)

/**
 * Builds Prisma based pagination parameters (skip/take)
 * Used for database queries to control result slicing.
 * Converts page-based input into offset-based pagination.
 */

export const getPagination = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return {
        skip,
        take: limit,
        page,
        limit,
    };
}

/**
 * Generates pagination metadata for API responses
 * Helps frontend understand dataset size and page structure.
 * Includes total count, current page, limit, and total pages.
 */

export const getPaginationMeta = (total: number, page: number, limit: number) => {
    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}