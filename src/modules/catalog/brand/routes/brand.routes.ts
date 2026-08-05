import { Router } from "express";
import { brandController } from "../controllers/brand.controller.js";
import { validateBrandBody, validateBrandId, validateBrandQuery, } from "../middlewares/brand.middleware.js";
import { brandIdSchema, brandQuerySchema, createBrandSchema, updateBrandSchema } from "../validators/brand.validator.js";
import { validateBody, validateParams } from "@/shared/middlewares/validate-request.middleware.js";


const router = Router();


router.post("/",
    validateBrandBody(createBrandSchema),
    brandController.create
);

router.get("/:id",
    validateBrandId(brandIdSchema),
    brandController.findById
);

router.get("/",
    validateBrandQuery(brandQuerySchema),
    brandController.findMany
);

router.patch("/:id",
    validateParams(brandIdSchema),
    validateBody(updateBrandSchema),
    brandController.update
);

export const brandRouter = router;