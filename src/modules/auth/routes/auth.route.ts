import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/verify-email", authController.verifyEmail);

// Protected routes
router.post("/logout", authenticate, authController.logout);
router.post("/logoutAll", authenticate, authController.logoutAll);
router.get("/profile", authenticate, authController.getProfile);


export const authRoutes = router;