
import { Router } from "express";

import { variantController } from "./variant.controller.js";
import { validateBody, validateParams } from "@/shared/middlewares/validate-request.middleware.js";

import {
    createVariantSchema,
    updateVariantSchema,
    variantProductIdSchema,
    variantIdParamsSchema,
} from "./variant.validators.js";

// ==================
// VARIANT ROUTES
// ==================

const router = Router({ mergeParams: true });


// ==================
// CREATE VARIANT
// ====================

router.post("/",
    validateParams(variantProductIdSchema),
    validateBody(createVariantSchema),
    variantController.create,
);


// ====================
// GET VARIANTS BY PRODUCT
// ====================

router.get("/",
    validateParams(variantProductIdSchema),
    variantController.getByProduct,
);


// ==============================
// GET ACTIVE VARIANTS BY PRODUCT
// ==============================

router.get("/active",
    validateParams(variantProductIdSchema),
    variantController.getActiveByProduct,
);


// ==============================
// GET DEFAULT VARIANT BY PRODUCT
// ==============================

router.get("/default",
    validateParams(variantProductIdSchema),
    variantController.getDefaultByProduct,
);


// ==========================
// COUNT VARIANTS BY PRODUCT
// ==========================

router.get("/count",
    validateParams(variantProductIdSchema),
    variantController.countByProduct,
);


// ====================
// GET VARIANT BY ID
// ====================

router.get("/:id",
    validateParams(variantIdParamsSchema),
    variantController.getById,
);


// ====================
// UPDATE VARIANT
// ====================

router.patch("/:id",
    validateParams(variantIdParamsSchema),
    validateBody(updateVariantSchema),
    variantController.update,
);


// ====================
// SET DEFAULT VARIANT
// ====================

router.patch("/:id/default",
    validateParams(variantIdParamsSchema),
    variantController.setDefault,
);


// ====================
// UNSET DEFAULT VARIANT
// ====================

router.patch("/:id/default/remove",
    validateParams(variantIdParamsSchema),
    variantController.unsetDefault,
);


// ====================
// ACTIVATE VARIANT
// ====================

router.patch("/:id/activate",
    validateParams(variantIdParamsSchema),
    variantController.activate,
);


// ====================
// DEACTIVATE VARIANT
// ====================

router.patch("/:id/deactivate",
    validateParams(variantIdParamsSchema),
    variantController.deactivate,
);


// ====================
// RESTORE VARIANT
// ====================

router.patch("/:id/restore",
    validateParams(variantIdParamsSchema),
    variantController.restore,
);


// ====================
// DELETE VARIANT
// ====================

router.delete("/:id",
    validateParams(variantIdParamsSchema),
    variantController.delete,
);


export const variantRouter = router;
