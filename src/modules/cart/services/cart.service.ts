
import { BadRequestError, NotFoundError } from "@/shared/errors/index.js";
import { CART_ERRORS } from "../constants/cart.errors.js";
import type { AddCartItemInput, UpdateCartItemInput } from "../types/cart.types.js";
import { cartRepository } from "../repositories/cart.repository.js";

// ============================
// CART SERVICE
// ============================

class CartService {

    // ============================
    // GET CART
    // ============================

    async getCart(userId: string) {
        return await cartRepository.findOrCreateByUserId(userId);
    }

    // ============================
    // FIND PRODUCT VARIANT
    // ============================

    private async getVariant(variantId: string) {
        const variant = await cartRepository.findVariantById(variantId);

        if (!variant) {
            throw new NotFoundError(
                CART_ERRORS.PRODUCT_VARIANT_NOT_FOUND
            );
        }

        if (!variant.isActive || variant.deletedAt) {
            throw new BadRequestError(
                CART_ERRORS.PRODUCT_VARIANT_INACTIVE
            );
        }

        if (
            !variant.product.isActive ||
            !variant.product.isPublished ||
            variant.product.deletedAt
        ) {
            throw new BadRequestError(
                CART_ERRORS.PRODUCT_UNAVAILABLE
            );
        }

        return variant;
    }

    // ============================
    // VALIDATE STOCK AVAILABILITY
    // ============================

    private validateStock(
        variant: {
            trackInventory: boolean;
            inventory: {
                quantity: number;
                reservedQuantity: number;
                allowBackorder: boolean;
            } | null;
        },
        quantity: number
    ): void {
        if (!variant.trackInventory || variant.inventory?.allowBackorder) {
            return;
        }

        const availableQuantity = (variant.inventory?.quantity ?? 0) - (variant.inventory?.reservedQuantity ?? 0);

        if (quantity > availableQuantity) {
            throw new BadRequestError(
                CART_ERRORS.INSUFFICIENT_STOCK
            );
        }
    }

    // ============================
    // ADD ITEM TO CART
    // ============================

    async addItem(userId: string, data: AddCartItemInput) {
        const variant = await this.getVariant(data.variantId);
        const cart = await cartRepository.findOrCreateByUserId(userId);

        const existingItem = await cartRepository.findItemByVariant(cart.id, data.variantId);

        const totalQuantity = (existingItem?.quantity ?? 0) + data.quantity;

        this.validateStock(variant, totalQuantity);

        await cartRepository.upsertItem(
            cart.id,
            data.variantId,
            data.quantity
        );

        return await cartRepository.findByUserId(userId);
    }

    // ============================
    // UPDATE CART ITEM QUANTITY
    // ============================

    async updateItem(userId: string, itemId: string, data: UpdateCartItemInput) {
        const cart = await cartRepository.findByUserId(userId);

        if (!cart) {
            throw new NotFoundError(CART_ERRORS.CART_NOT_FOUND);
        }

        const item = await cartRepository.findItemById(cart.id, itemId);

        if (!item) {
            throw new NotFoundError(CART_ERRORS.CART_ITEM_NOT_FOUND);
        }

        const variant = await this.getVariant(item.variantId);

        this.validateStock(variant, data.quantity);

        const result = await cartRepository.updateItemQuantity(cart.id, itemId, data.quantity);

        if (result.count === 0) {
            throw new NotFoundError(CART_ERRORS.CART_ITEM_NOT_FOUND);
        }

        return await cartRepository.findByUserId(userId);
    }

    // ============================
    // REMOVE ITEM FROM CART
    // ============================

    async removeItem(userId: string, itemId: string) {
        const cart = await cartRepository.findByUserId(userId);

        if (!cart) {
            throw new NotFoundError(CART_ERRORS.CART_NOT_FOUND);
        }

        const result = await cartRepository.deleteItem(cart.id, itemId);

        if (result.count === 0) {
            throw new NotFoundError(CART_ERRORS.CART_ITEM_NOT_FOUND);
        }

        return await cartRepository.findByUserId(userId);
    }

    // ============================
    // CLEAR CART
    // ============================

    async clearCart(userId: string) {
        const cart = await cartRepository.findByUserId(userId);

        if (!cart) {
            throw new NotFoundError(CART_ERRORS.CART_NOT_FOUND);
        }

        await cartRepository.clearItems(cart.id);

        return await cartRepository.findByUserId(userId);
    }
}

// ============================
// EXPORT CART SERVICE
// ============================

export const cartService = new CartService();
