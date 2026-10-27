import { Router } from "express";
import { productImageController } from "./product-image.controller.js";
import { productImageParamsSchema, productImageIdParamsSchema, createProductImageSchema, updateProductImageSchema, } from "./product-image.validators.js";
import { validateBody, validateParams, } from "@/shared/middlewares/validate-request.middleware.js";


const router = Router({ mergeParams: true });


router.post("/",
    validateParams(productImageParamsSchema),
    validateBody(createProductImageSchema),
    productImageController.create
);


router.get("/",
    validateParams(productImageParamsSchema),
    productImageController.findByVariant
);


router.get("/:imageId",
    validateParams(productImageIdParamsSchema),
    productImageController.findById
);


router.patch("/:imageId",
    validateParams(productImageIdParamsSchema),
    validateBody(updateProductImageSchema),
    productImageController.update
);


router.delete("/:imageId",
    validateParams(productImageIdParamsSchema),
    productImageController.delete
);


export const productImageRouter = router;