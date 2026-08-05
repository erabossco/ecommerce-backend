import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { categoryIdSchema, categoryQuerySchema, createCategorySchema, updateCategorySchema } from "../validators/category.validator.js";
import { validateBody, validateParams, validateQuery } from "@/shared/middlewares/validate-request.middleware.js";

const router = Router();



// =======================
// CATEGORY ROUTES
// =======================

router.post("/",
    validateBody(createCategorySchema),
    categoryController.create);

router.get("/:id",
    validateParams(categoryIdSchema),
    categoryController.findById);

router.get("/",
    validateQuery(categoryQuerySchema),
    categoryController.findMany);

router.patch("/:id",
    validateParams(categoryIdSchema),
    validateBody(updateCategorySchema),
    categoryController.update);

router.delete("/:id",
    validateParams(categoryIdSchema),
    categoryController.delete);

export const categoryRouter = router;