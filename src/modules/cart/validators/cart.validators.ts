import { z } from "zod";
import { CART_ERRORS } from "../constants/cart.errors.js";

// ============================
// ADD ITEM TO CART
// ============================

export const addCartItemSchema = z.object({
    variantId: z
        .string()
        .regex(/^[a-z][a-z0-9]{23}$/, CART_ERRORS.INVALID_VARIANT_ID),

    quantity: z
        .number()
        .int({ error: CART_ERRORS.INVALID_QUANTITY })
        .positive({ error: CART_ERRORS.INVALID_QUANTITY }),
});

// ============================
// UPDATE CART ITEM
// ============================

export const updateCartItemSchema = z.object({
    quantity: z
        .number()
        .int({ error: CART_ERRORS.INVALID_QUANTITY })
        .positive({ error: CART_ERRORS.INVALID_QUANTITY }),
});

// ITEM ID
export const cartItemIdParamsSchema = z.object({
    itemId: z
        .string()
        .regex(/^[a-z][a-z0-9]{23}$/, { error: CART_ERRORS.INVALID_ITEM_ID }),
});
