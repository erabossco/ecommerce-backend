// src/shared/constants/success-messages.ts

export const SUCCESS_MESSAGES = {

    // ====================
    // GENERAL
    // ====================

    CREATED: "Resource created successfully.",
    FETCHED: "Resource fetched successfully.",
    UPDATED: "Resource updated successfully.",
    DELETED: "Resource deleted successfully.",
    RESTORED: "Resource restored successfully.",

    // ====================
    // AUTHENTICATION
    // ====================

    REGISTERED: "User registered successfully.",
    LOGGED_IN: "Logged in successfully.",
    LOGGED_OUT: "Logged out successfully.",
    TOKEN_REFRESHED: "Token refreshed successfully.",
    PASSWORD_CHANGED: "Password changed successfully.",
    PASSWORD_RESET: "Password reset successfully.",
    EMAIL_VERIFIED: "Email verified successfully.",

    // ====================
    // USER
    // ====================

    USER_CREATED: "User created successfully.",
    USER_FETCHED: "User fetched successfully.",
    USER_UPDATED: "User updated successfully.",
    USER_DELETED: "User deleted successfully.",
    USER_RESTORED: "User restored successfully.",

    // ====================
    // PRODUCT
    // ====================

    PRODUCT_CREATED: "Product created successfully.",
    PRODUCT_FETCHED: "Product fetched successfully.",
    PRODUCT_UPDATED: "Product updated successfully.",
    PRODUCT_DELETED: "Product deleted successfully.",
    PRODUCT_RESTORED: "Product restored successfully.",
    PRODUCT_PUBLISHED: "Product published successfully.",
    PRODUCT_UNPUBLISHED: "Product unpublished successfully.",

    // ====================
    // PRODUCT VARIANT
    // ====================

    VARIANT_CREATED: "Product variant created successfully.",
    VARIANT_FETCHED: "Product variant fetched successfully.",
    VARIANT_UPDATED: "Product variant updated successfully.",
    VARIANT_DELETED: "Product variant deleted successfully.",
    VARIANT_RESTORED: "Product variant restored successfully.",
    VARIANT_ACTIVATED: "Product variant activated successfully.",
    VARIANT_DEACTIVATED: "Product variant deactivated successfully.",
    VARIANT_SET_DEFAULT: "Default product variant set successfully.",
    VARIANT_UNSET_DEFAULT: "Default product variant removed successfully.",

    // ====================
    // CATEGORY
    // ====================

    CATEGORY_CREATED: "Category created successfully.",
    CATEGORY_FETCHED: "Category fetched successfully.",
    CATEGORY_UPDATED: "Category updated successfully.",
    CATEGORY_DELETED: "Category deleted successfully.",
    CATEGORY_RESTORED: "Category restored successfully.",

    // ====================
    // BRAND
    // ====================

    BRAND_CREATED: "Brand created successfully.",
    BRAND_FETCHED: "Brand fetched successfully.",
    BRAND_UPDATED: "Brand updated successfully.",
    BRAND_DELETED: "Brand deleted successfully.",
    BRAND_RESTORED: "Brand restored successfully.",

    // ====================
    // PRODUCT IMAGE
    // ====================

    PRODUCT_IMAGE_CREATED: "Product image created successfully.",
    PRODUCT_IMAGE_FETCHED: "Product image fetched successfully.",
    PRODUCT_IMAGE_UPDATED: "Product image updated successfully.",
    PRODUCT_IMAGE_DELETED: "Product image deleted successfully.",
    PRODUCT_IMAGE_SET_PRIMARY: "Primary product image set successfully.",

    // ====================
    // INVENTORY
    // ====================

    INVENTORY_CREATED: "Inventory created successfully.",
    INVENTORY_FETCHED: "Inventory fetched successfully.",
    INVENTORY_UPDATED: "Inventory updated successfully.",
    INVENTORY_ADJUSTED: "Inventory adjusted successfully.",

    // ====================
    // CART
    // ====================

    CART_FETCHED: "Cart fetched successfully.",
    CART_ITEM_ADDED: "Item added to cart successfully.",
    CART_ITEM_UPDATED: "Cart item updated successfully.",
    CART_ITEM_REMOVED: "Item removed from cart successfully.",
    CART_CLEARED: "Cart cleared successfully.",

    // ====================
    // ORDER
    // ====================

    ORDER_CREATED: "Order created successfully.",
    ORDER_FETCHED: "Order fetched successfully.",
    ORDER_UPDATED: "Order updated successfully.",
    ORDER_CANCELLED: "Order cancelled successfully.",
    ORDER_CONFIRMED: "Order confirmed successfully.",

    // ====================
    // PAYMENT
    // ====================

    PAYMENT_INITIATED: "Payment initiated successfully.",
    PAYMENT_COMPLETED: "Payment completed successfully.",
    PAYMENT_REFUNDED: "Payment refunded successfully.",

} as const;
