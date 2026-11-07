
import { Router } from "express";
import { addressController } from "../controllers/address.controller.js";
import { authenticate } from "@/modules/auth/middlewares/auth.middleware.js";
import { validateBody, validateParams } from "@/shared/middlewares/validate-request.middleware.js";
import {
    createAddressSchema,
    updateAddressSchema,
    addressIdParamsSchema,
} from "../validators/address.validators.js";

// ============================
// ADDRESS ROUTER
// ============================

const router = Router();

// ============================
// ADDRESS ROUTES
// ============================

// GET ALL ADDRESSES

router.get("/",
    authenticate,
    addressController.findAll,
);

// GET ADDRESS BY ID

router.get("/:addressId",
    authenticate,
    validateParams(addressIdParamsSchema),
    addressController.findById,
);

// CREATE ADDRESS

router.post("/",
    authenticate,
    validateBody(createAddressSchema),
    addressController.create,
);

// UPDATE ADDRESS

router.patch("/:addressId",
    authenticate,
    validateParams(addressIdParamsSchema),
    validateBody(updateAddressSchema),
    addressController.update,
);

// DELETE ADDRESS

router.delete("/:addressId",
    authenticate,
    validateParams(addressIdParamsSchema),
    addressController.delete,
);

// ============================
// EXPORT ADDRESS ROUTER
// ============================

export const addressRouter = router;
