import { Router } from "express";
import { authRoutes } from "@/modules/auth/routes/auth.route.js";
import { categoryModule } from "@/modules/catalog/category/category.module.js";

const router = Router();
router.use("/auth", authRoutes);
router.use("/api/v1/categories", categoryModule.router);


export const appRouter = router;