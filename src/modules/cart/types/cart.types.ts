import type { z } from "zod";

import { addCartItemSchema, updateCartItemSchema } from "../validators/cart.validators.js";

// ============================
// ADD CART ITEM TYPE
// ============================

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;

// ============================
// UPDATE CART ITEM TYPE
// ============================

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
