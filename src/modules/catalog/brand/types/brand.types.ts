import z from "zod";
import type { createBrandSchema } from "../validators/brand.validator.js";

export type CreateBrandDto = z.infer<typeof createBrandSchema>