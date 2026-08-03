import { Router } from "express";
import { brandController } from "../controllers/brand.controller.js";
import { validateBrandBody, validateBrandId, validateBrandQuery, } from "../middlewares/brand.middleware.js";
import { brandIdSchema, brandQuerySchema, createBrandSchema } from "../validators/brand.validator.js";


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

export const brandRouter = router;