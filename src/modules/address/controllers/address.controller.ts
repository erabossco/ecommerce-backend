
import type { Request, Response, NextFunction } from "express";
import { ADDRESS_MESSAGES } from "../constants/address.constants.js";
import { addressService } from "../services/address.service.js";
import type { AddressIdParams, CreateAddressInput, UpdateAddressInput } from "../types/address.types.js";

// ============================
// ADDRESS CONTROLLER
// ============================

class AddressController {

    // ============================
    // GET ALL ADDRESSES
    // ============================

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId as string;

            const addresses = await addressService.findAllByUserId(userId);

            res.status(200).json({
                success: true,
                message: ADDRESS_MESSAGES.ADDRESSES_FETCHED,
                data: addresses,
            });

        } catch (error) {
            next(error);
        }
    }

    // ============================
    // GET ADDRESS BY ID
    // ============================

    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId as string;
            const { addressId } = res.locals.params as AddressIdParams;

            const address = await addressService.findById(userId, addressId);

            res.status(200).json({
                success: true,
                message: ADDRESS_MESSAGES.ADDRESS_FETCHED,
                data: address,
            });

        } catch (error) {
            next(error);
        }
    }

    // ============================
    // CREATE ADDRESS
    // ============================

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId as string;
            const data = res.locals.body as CreateAddressInput;

            const address = await addressService.create(userId, data);

            res.status(201).json({
                success: true,
                message: ADDRESS_MESSAGES.ADDRESS_CREATED,
                data: address,
            });

        } catch (error) {
            next(error);
        }
    }

    // ============================
    // UPDATE ADDRESS
    // ============================

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId as string;
            const { addressId } = res.locals.params as AddressIdParams;
            const data = res.locals.body as UpdateAddressInput;

            const address = await addressService.update(userId, addressId, data);

            res.status(200).json({
                success: true,
                message: ADDRESS_MESSAGES.ADDRESS_UPDATED,
                data: address,
            });

        } catch (error) {
            next(error);
        }
    }

    // ============================
    // DELETE ADDRESS
    // ============================

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId as string;
            const { addressId } = res.locals.params as AddressIdParams;

            await addressService.delete(userId, addressId);

            res.status(200).json({
                success: true,
                message: ADDRESS_MESSAGES.ADDRESS_DELETED,
            });

        } catch (error) {
            next(error);
        }
    }
}

// ============================
// EXPORT ADDRESS CONTROLLER
// ============================

export const addressController = new AddressController();
