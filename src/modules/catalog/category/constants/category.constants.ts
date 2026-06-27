
// ==========================
// CATEGORY CONSTANTS
// ==========================

export const CATEGORY = {
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 50,
    },

    SLUG: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
    },

    DESCRIPTION: {
        MAX_LENGTH: 1000,
    },

    IMAGE_URL: {
        MAX_LENGTH: 100,
    },
} as const;


// =========================
// CATEGORY SORT BY
// =========================

export const CATEGORY_SORT_FIELDS = [
    "name",
    "createdAt",
    "updatedAt",
] as const;

// TYPE OF CATEGORY SORT FIELD

export type CategorySortField =
    (typeof CATEGORY_SORT_FIELDS)[number];