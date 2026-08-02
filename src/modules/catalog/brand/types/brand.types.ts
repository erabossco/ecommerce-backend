import z from "zod";
import type { brandIdSchema, createBrandSchema } from "../validators/brand.validator.js";

export type CreateBrandDto = z.infer<typeof createBrandSchema>;

export type BrandIdDto = z.infer<typeof brandIdSchema>;