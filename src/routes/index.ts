import { Router } from "express";
import { categoryModule } from "@/modules/catalog/category/category.module.js";
import { authModule } from "@/modules/auth/auth.module.js";

const router = Router();
router.use("/auth", authModule.router);
router.use("/categories", categoryModule.router);


export const appRouter = router;