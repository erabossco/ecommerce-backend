import { z } from 'zod';
import { ADDRESS_MESSAGES } from '../constants/address.constants.js';

const addressIdSchema = z
    .string({ error: ADDRESS_MESSAGES.INVALID_ADDRESS_ID })
    .regex(/^[a-z][a-z0-9]{23}$/, { error: ADDRESS_MESSAGES.INVALID_ADDRESS_ID });

export const createAddressSchema = z.object({
    fullName: z
        .string({ error: ADDRESS_MESSAGES.INVALID_FULL_NAME })
        .trim()
        .min(1, { error: ADDRESS_MESSAGES.INVALID_FULL_NAME })
        .max(100, { error: ADDRESS_MESSAGES.INVALID_FULL_NAME }),

    phone: z
        .string({ error: ADDRESS_MESSAGES.INVALID_PHONE })
        .trim()
        .min(1, { error: ADDRESS_MESSAGES.INVALID_PHONE })
        .max(20, { error: ADDRESS_MESSAGES.INVALID_PHONE }),

    addressLine1: z
        .string({ error: ADDRESS_MESSAGES.INVALID_ADDRESS_LINE1 })
        .trim()
        .min(1, { error: ADDRESS_MESSAGES.INVALID_ADDRESS_LINE1 })
        .max(255, { error: ADDRESS_MESSAGES.INVALID_ADDRESS_LINE1 }),

    addressLine2: z
        .string({ error: ADDRESS_MESSAGES.INVALID_ADDRESS_LINE2 })
        .trim()
        .max(255, { error: ADDRESS_MESSAGES.INVALID_ADDRESS_LINE2 })
        .optional(),

    city: z
        .string({ error: ADDRESS_MESSAGES.INVALID_CITY })
        .trim()
        .min(1, { error: ADDRESS_MESSAGES.INVALID_CITY })
        .max(100, { error: ADDRESS_MESSAGES.INVALID_CITY }),

    state: z
        .string({ error: ADDRESS_MESSAGES.INVALID_STATE })
        .trim()
        .max(100, { error: ADDRESS_MESSAGES.INVALID_STATE })
        .optional(),

    postalCode: z
        .string({ error: ADDRESS_MESSAGES.INVALID_POSTAL_CODE })
        .trim()
        .max(20, { error: ADDRESS_MESSAGES.INVALID_POSTAL_CODE })
        .optional(),

    country: z
        .string({ error: ADDRESS_MESSAGES.INVALID_COUNTRY })
        .trim()
        .min(1, { error: ADDRESS_MESSAGES.INVALID_COUNTRY })
        .max(100, { error: ADDRESS_MESSAGES.INVALID_COUNTRY }),

    addressType: z.enum(['HOME', 'OFFICE', 'OTHER'], { error: ADDRESS_MESSAGES.INVALID_ADDRESS_TYPE }).optional(),

    isDefaultShipping: z
        .boolean({ error: ADDRESS_MESSAGES.INVALID_DEFAULT_SHIPPING })
        .optional(),

    isDefaultBilling: z
        .boolean({ error: ADDRESS_MESSAGES.INVALID_DEFAULT_BILLING })
        .optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

export const addressIdParamsSchema = z.object({
    addressId: addressIdSchema,
});