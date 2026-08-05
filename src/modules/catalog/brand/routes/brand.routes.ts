import { Router } from "express";
import { brandController } from "../controllers/brand.controller.js";
import { brandIdSchema, brandQuerySchema, createBrandSchema, updateBrandSchema } from "../validators/brand.validator.js";
import { validateBody, validateParams, validateQuery } from "@/shared/middlewares/validate-request.middleware.js";


const router = Router();


router.post("/",
    validateBody(createBrandSchema),
    brandController.create
);

router.get("/:id",
    validateParams(brandIdSchema),
    brandController.findById
);

router.get("/",
    validateQuery(brandQuerySchema),
    brandController.findMany
);

router.patch("/:id",
    validateParams(brandIdSchema),
    validateBody(updateBrandSchema),
    brandController.update
);

export const brandRouter = router;