import { Router } from "express";

import { variantModule } from "../variant/variant.module.js";
import { inventoryModule } from "../inventory/inventory.module.js";
import { productRouter } from "./routes/product.routes.js";
import { productImageModule } from "../product-image/product-image.module.js";

const router = Router();


// Product Variant
router.use("/variants", variantModule.router);

// Product Variant images
router.use("/:productId/variants/:variantId/images", productImageModule.router);

// Inventory

router.use("/inventory", inventoryModule.router);

// Product Image


// Product 
router.use("/", productRouter);

// appRouter is using "/products" for product module
export const productModule = {
    router,
};