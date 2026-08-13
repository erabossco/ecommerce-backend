import z from "zod";
import type { brandIdSchema, categoryIdSchema, productIdSchema } from "../validators/common.validator.js";

export type ID = string;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncResult<T> = Promise<T>

export type BrandIdDto = z.infer<typeof brandIdSchema>;
export type CategoryIdDto = z.infer<typeof categoryIdSchema>
export type ProductIdDto = z.infer<typeof productIdSchema>