import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { validateCategoryBody, validateCategoryId, validateCategoryQuery } from "../middlewares/validate-category.middleware.js";
import { categoryIdSchema, categoryQuerySchema, createCategorySchema, updateCategorySchema } from "../validators/category.validator.js";

const router = Router();



// =======================
// CATEGORY ROUTES
// =======================

router.post("/",
    validateCategoryBody(createCategorySchema),
    categoryController.create);

router.get("/:id",
    validateCategoryId(categoryIdSchema),
    categoryController.findById);

router.get("/",
    validateCategoryQuery(categoryQuerySchema),
    categoryController.findMany);

router.patch("/:id",
    validateCategoryId(categoryIdSchema),
    validateCategoryBody(updateCategorySchema),
    categoryController.update);

router.delete("/:id",
    validateCategoryId(categoryIdSchema),
    categoryController.delete);

export const categoryRouter = router;