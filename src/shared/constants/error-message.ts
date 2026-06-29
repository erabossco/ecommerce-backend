export const ERROR_MESSAGES = {
    CATEGORY_NOT_FOUND: "Category not found.",
    CATEGORY_NAME_EXISTS: "Category name already exists.",
    CATEGORY_SLUG_EXISTS: "Category slug already exists.",
    PARENT_CATEGORY_NOT_FOUND: "Parent category not found.",
    CATEGORY_SELF_PARENT: "A category cannot be its own parent.",
    CATEGORY_HAS_CHILDREN: "Category has children.",
    PARENT_CATEGORY_DELETED: "Parent category was deleted."
} as const;