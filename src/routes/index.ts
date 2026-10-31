import { Router } from "express";
import { categoryModule } from "@/modules/catalog/category/category.module.js";
import { authModule } from "@/modules/auth/auth.module.js";
import { brandModule } from "@/modules/catalog/brand/brand.module.js";
import { productModule } from "@/modules/catalog/product/product.module.js";
import { cartModule } from "@/modules/cart/cart.module.js";

const router = Router();
router.use("/auth", authModule.router);
router.use("/categories", categoryModule.router);
router.use("/brands", brandModule.router);
router.use("/products", productModule.router);
router.use("/cart", cartModule.router);


export const appRouter = router;