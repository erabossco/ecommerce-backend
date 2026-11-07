import { z } from 'zod';
import {
    createAddressSchema,
    updateAddressSchema,
    addressIdParamsSchema,
} from '../validators/address.validators.js';



export type CreateAddressInput = z.infer<typeof createAddressSchema>;

export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;

export type AddressIdParams = z.infer<typeof addressIdParamsSchema>;