import { Router } from "express";

import { globalVariantModule, variantModule } from "../variant/variant.module.js";
import { inventoryModule } from "../inventory/inventory.module.js";
import { productRouter } from "./routes/product.routes.js";
import { productImageModule } from "../product-image/product-image.module.js";

const router = Router();

// Glogal Variants 
router.use("/variants", globalVariantModule.router);

// Product Variants
router.use("/:productId/variants", variantModule.router);

// Product Variant images
router.use("/:productId/variants/:variantId/images", productImageModule.router);

// Inventory

router.use("/inventory", inventoryModule.router);


// Product 
router.use("/", productRouter);

// appRouter is using "/products" for product module
export const productModule = {
    router,
};