import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { validateCategoryId, validateCategoryQuery } from "../validators/validate-category.middleware.js";
import { categoryIdSchema, categoryQuerySchema } from "../validators/category.validator.js";

const router = Router();



// =======================
// CATEGORY ROUTES
// =======================

router.post("/", categoryController.create);

router.get("/:id",
    validateCategoryId(categoryIdSchema),
    categoryController.findById);

router.get("/",
    validateCategoryQuery(categoryQuerySchema),
    categoryController.findMany);

router.patch("/:id",
    validateCategoryId(categoryIdSchema),
    categoryController.update);

router.delete("/:id",
    validateCategoryId(categoryIdSchema),
    categoryController.delete);

export const categoryRouter = router;