import type { Address } from "@prisma/client";
import { NotFoundError } from "@/shared/errors/not-found.error.js";
import { ADDRESS_MESSAGES } from "../constants/address.constants.js";
import { addressRepository } from "../repositories/address.repository.js";
import type { CreateAddressInput, UpdateAddressInput, } from "../types/address.types.js";

// ============================
// ADDRESS SERVICE
// ============================

class AddressService {

    // ============================
    // GET ALL ADDRESSES
    // ============================

    async findAllByUserId(userId: string): Promise<Address[]> {
        return await addressRepository.findAllByUserId(userId);
    }

    // ============================
    // GET ADDRESS BY ID
    // ============================

    async findById(userId: string, addressId: string): Promise<Address> {

        const address = await addressRepository.findById(userId, addressId);

        if (!address) {
            throw new NotFoundError(ADDRESS_MESSAGES.ADDRESS_NOT_FOUND);
        }

        return address;
    }

    // ============================
    // CREATE ADDRESS
    // ============================

    async create(userId: string, data: CreateAddressInput): Promise<Address> {

        // CLEAR DEFAULT SHIPPING ADDRESS

        if (data.isDefaultShipping) {
            await addressRepository.clearDefaultShipping(userId);
        }

        // CLEAR DEFAULT BILLING ADDRESS

        if (data.isDefaultBilling) {
            await addressRepository.clearDefaultBilling(userId);
        }

        return await addressRepository.create(userId, data);
    }

    // ============================
    // UPDATE ADDRESS
    // ============================

    async update(userId: string, addressId: string, data: UpdateAddressInput,): Promise<Address> {

        // CHECK ADDRESS

        await this.findById(userId, addressId);

        // CLEAR DEFAULT SHIPPING ADDRESS

        if (data.isDefaultShipping) {
            await addressRepository.clearDefaultShipping(userId, addressId);
        }

        // CLEAR DEFAULT BILLING ADDRESS

        if (data.isDefaultBilling) {
            await addressRepository.clearDefaultBilling(userId, addressId);
        }

        // UPDATE ADDRESS

        await addressRepository.update(userId, addressId, data);

        return await this.findById(userId, addressId);
    }

    // ============================
    // DELETE ADDRESS
    // ============================

    async delete(userId: string, addressId: string): Promise<void> {

        // CHECK ADDRESS

        await this.findById(userId, addressId);

        // DELETE ADDRESS

        await addressRepository.delete(userId, addressId);
    }
}

// ============================
// EXPORT ADDRESS SERVICE
// ============================

export const addressService = new AddressService();