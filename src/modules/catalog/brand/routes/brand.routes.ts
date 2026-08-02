import { Router } from "express";
import { brandController } from "../controllers/brand.controller.js";
import { validateBrandBody, validateBrandId } from "../middlewares/brand.middleware.js";
import { brandIdSchema, createBrandSchema } from "../validators/brand.validator.js";


const router = Router();


router.post("/",
    validateBrandBody(createBrandSchema),
    brandController.create
);

router.get("/:id",
    validateBrandId(brandIdSchema),
    brandController.findById
)

export const brandRouter = router;