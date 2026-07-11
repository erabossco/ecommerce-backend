import { Router } from "express";
import { brandController } from "../controllers/brand.controller.js";
import { validateBrandBody } from "../middlewares/brand.middleware.js";
import { createBrandSchema } from "../validators/brand.validator.js";


const router = Router();


router.post("/",
    validateBrandBody(createBrandSchema),
    brandController.create
);

export const brandRouter = router;