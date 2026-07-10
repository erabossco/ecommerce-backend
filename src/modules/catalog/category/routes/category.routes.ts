import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { validateCategoryQuery } from "@/shared/middlewares/validate-category-query.js";
import { categoryQuerySchema } from "../validators/category.validator.js";

const router = Router();



// =======================
// CATEGORY ROUTES
// =======================

router.post("/", categoryController.create);

router.get("/:id", categoryController.findById);

router.get("/",
    validateCategoryQuery(categoryQuerySchema),
    categoryController.findMany);

router.patch("/:id", categoryController.update);

router.delete("/:id", categoryController.delete);

export const categoryRouter = router;