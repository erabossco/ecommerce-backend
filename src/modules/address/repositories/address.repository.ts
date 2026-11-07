import type { Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";
import type { Address } from "@prisma/client";
import type { CreateAddressInput, UpdateAddressInput } from "../types/address.types.js";

// ============================
// ADDRESS REPOSITORY
// ============================

class AddressRepository {

    // ============================
    // FIND ALL ADDRESSES BY USER ID
    // ============================

    async findAllByUserId(userId: string): Promise<Address[]> {
        return await prisma.address.findMany({
            where: { userId },
            orderBy: {
                updatedAt: "desc",
            },
        });
    }

    // ============================
    // FIND ADDRESS BY ID
    // ============================

    async findById(userId: string, addressId: string): Promise<Address | null> {
        return await prisma.address.findFirst({
            where: {
                id: addressId,
                userId,
            },
        });
    }

    // ============================
    // CREATE ADDRESS
    // ============================

    async create(userId: string, data: CreateAddressInput): Promise<Address> {
        return await prisma.address.create({
            data: {
                ...data,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            } as Prisma.AddressCreateInput,
        });
    }

    // ============================
    // UPDATE ADDRESS
    // ============================

    async update(userId: string, addressId: string, data: UpdateAddressInput): Promise<Prisma.BatchPayload> {
        return await prisma.address.updateMany({
            where: {
                id: addressId,
                userId,
            },
            data: data as Prisma.AddressUpdateManyMutationInput,
        });
    }

    // ============================
    // DELETE ADDRESS
    // ============================

    async delete(userId: string, addressId: string): Promise<Prisma.BatchPayload> {
        return await prisma.address.deleteMany({
            where: {
                id: addressId,
                userId,
            },
        });
    }

    // ============================
    // CLEAR DEFAULT SHIPPING ADDRESS
    // ============================

    async clearDefaultShipping(userId: string, excludeAddressId?: string): Promise<Prisma.BatchPayload> {
        return await prisma.address.updateMany({
            where: {
                userId,
                isDefaultShipping: true,
                ...(excludeAddressId && {
                    id: { not: excludeAddressId },
                }),
            },
            data: {
                isDefaultShipping: false,
            },
        });
    }

    // ============================
    // CLEAR DEFAULT BILLING ADDRESS
    // ============================

    async clearDefaultBilling(userId: string, excludeAddressId?: string): Promise<Prisma.BatchPayload> {
        return await prisma.address.updateMany({
            where: {
                userId,
                isDefaultBilling: true,
                ...(excludeAddressId && {
                    id: { not: excludeAddressId },
                }),
            },
            data: {
                isDefaultBilling: false,
            },
        });
    }
}

// ============================
// EXPORT ADDRESS REPOSITORY
// ============================

export const addressRepository = new AddressRepository();