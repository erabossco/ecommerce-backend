// ============================
// PRODUCT IMAGE ERRORS
// ============================

export const PRODUCT_IMAGE_ERRORS = {
    PRODUCT_NOT_FOUND: "Product not found",
    VARIANT_NOT_FOUND: "Product variant not found",
    IMAGE_NOT_FOUND: "Product image not found",

    IMAGE_URL_REQUIRED: "Image URL is required",
    PRODUCT_ID_REQUIRED: "Product ID is required. (at product image)",
    VARIANT_ID_REQUIRED: "Variant ID is required. (at product image)",
    IMAGE_ID_REQUIRED: "Image ID is required. (at product image)",
    INVALID_IMAGE_URL: "A valid image URL is required",

    IMAGE_ALT_TEXT_TOO_LONG: "Alt text cannot exceed 255 characters",
    INVALID_SORT_ORDER: "Sort order cannot be negative",

    IMAGE_DATA_REQUIRED: "At least one field must be provided",
} as const;