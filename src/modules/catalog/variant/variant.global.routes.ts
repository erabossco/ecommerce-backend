import { Router } from "express";
import { variantController } from "./variant.controller.js";
import { validateParams } from "@/shared/middlewares/validate-request.middleware.js";
import { variantSkuSchema, variantBarcodeSchema, } from "./variant.validators.js";

const router = Router();

// ======================
// GET ALL VARIANTS
// ======================

router.get("/", variantController.getAll);

// ======================
// GET ALL ACTIVE VARIANTS
// ======================

router.get("/active", variantController.getActive);

// ======================
// GET VARIANT BY SKU
// ======================

router.get("/sku/:sku",
    validateParams(variantSkuSchema),
    variantController.getBySku,
);

// ======================
// GET VARIANT BY BARCODE
// ======================

router.get("/barcode/:barcode",
    validateParams(variantBarcodeSchema),
    variantController.getByBarcode,
);

export const globalVariantRouter = router;