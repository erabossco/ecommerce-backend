import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";

const router = Router();



// =======================
// CATEGORY ROUTES
// =======================

router.post("/", categoryController.create);
router.get("/:id", categoryController.findById);
router.get("/", categoryController.findMany);
router.patch("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);

export const categoryRouter = router;