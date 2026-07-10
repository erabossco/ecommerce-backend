export const ERROR_MESSAGES = {
    // App error

    CATEGORY_NOT_FOUND: "Category not found.",
    CATEGORY_NAME_EXISTS: "Category name already exists.",
    CATEGORY_SLUG_EXISTS: "Category slug already exists.",
    PARENT_CATEGORY_NOT_FOUND: "Parent category not found.",
    CATEGORY_SELF_PARENT: "A category cannot be its own parent.",
    CATEGORY_HAS_CHILDREN: "Category has children.",
    PARENT_CATEGORY_DELETED: "Parent category was deleted.",
    INTERNAL_SERVER_ERROR: "Internal server error.",

    // Validation error
    VALIDATION_FAILED: "Validation failed.",
    INVALID_PAGE_NUMBER: "Invalid page number.",
    INVALID_CATEGORY_LIMIT: "Invalid category limit.",
    INVALID_CATEGORY_SEARCH: "Invalid category search.",
    INVALID_PARENT_ID: "Invalid parent id.",
    INVALID_CATEGORY_ACTIVE_STATUS: "Invalid category active status",
    INVALID_CATEGORY_SORTBY: "Invalid category sortBy",
    INVALID_CATEGORY_ORDER: "Invalid category order",

} as const;