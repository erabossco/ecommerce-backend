import { Router } from "express";
import { authRoutes } from "@/modules/auth/routes/auth.route.js";

const router = Router();
router.use("/auth", authRoutes);


export const appRouter = router;