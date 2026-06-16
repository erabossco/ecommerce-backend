import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";

const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);

// Protected routes
router.post("/logout", authController.logout);
router.post("/logoutAll", authController.logoutAll);
router.get("/profile", authController.myProfile);


export const authRoutes = router;