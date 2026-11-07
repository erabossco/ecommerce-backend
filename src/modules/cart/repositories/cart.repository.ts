import type { Cart, CartItem, Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";

// ============================
// CART INCLUDE
// ============================

const cartInclude = {
    items: {
        orderBy: {
            createdAt: "desc",
        },
        include: {
            variant: {
                include: {
                    product: true,
                    inventory: true,
                    images: {
                        orderBy: [
                            { isPrimary: "desc" },
                            { sortOrder: "asc" },
                        ],
                        take: 1,
                    },
                },
            },
        },
    },
} satisfies Prisma.CartInclude;

// ============================
// CART ITEM INCLUDE
// ============================

const cartItemInclude = {
    variant: {
        include: {
            product: true,
            inventory: true,
            images: {
                orderBy: [
                    { isPrimary: "desc" },
                    { sortOrder: "asc" },
                ],
                take: 1,
            },
        },
    },
} satisfies Prisma.CartItemInclude;

// ============================
// CART REPOSITORY
// ============================

class CartRepository {

    // ============================
    // FIND CART BY ID
    // ============================

    async findById(cartId: string): Promise<Cart | null> {
        return await prisma.cart.findUnique({
            where: { id: cartId },
            include: cartInclude,
        });
    }

    // ============================
    // FIND CART BY USER ID
    // ============================

    async findByUserId(userId: string): Promise<Cart | null> {
        return await prisma.cart.findUnique({
            where: { userId },
            include: cartInclude,
        });
    }

    // ============================
    // FIND CART BY GUEST TOKEN HASH
    // ============================

    async findByGuestTokenHash(guestTokenHash: string): Promise<Cart | null> {
        return await prisma.cart.findUnique({
            where: { guestTokenHash },
            include: cartInclude,
        });
    }

    // ============================
    // FIND OR CREATE CART BY USER ID
    // ============================

    async findOrCreateByUserId(userId: string): Promise<Cart> {
        return await prisma.cart.upsert({
            where: { userId },
            update: {},
            create: { userId },
            include: cartInclude,
        });
    }

    // ============================
    // CREATE GUEST CART
    // ============================

    async createGuestCart(guestTokenHash: string, expiresAt: Date): Promise<Cart> {
        return await prisma.cart.create({
            data: {
                guestTokenHash,
                expiresAt,
            },
            include: cartInclude,
        });
    }

    // ============================
    // CLAIM GUEST CART
    // ============================

    async claimGuestCart(cartId: string, guestTokenHash: string, userId: string): Promise<Prisma.BatchPayload> {
        return await prisma.cart.updateMany({
            where: {
                id: cartId,
                guestTokenHash,
                userId: null,
            },
            data: {
                userId,
                guestTokenHash: null,
                expiresAt: null,
            },
        });
    }

    // ============================
    // FIND CART ITEM BY ID
    // ============================

    async findItemById(cartId: string, itemId: string): Promise<Prisma.CartItemGetPayload<{ include: typeof cartItemInclude }> | null> {
        return await prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId,
            },
            include: cartItemInclude,
        });
    }

    // ============================
    // FIND CART ITEM BY VARIANT
    // ============================

    async findItemByVariant(cartId: string, variantId: string): Promise<Prisma.CartItemGetPayload<{ include: typeof cartItemInclude }> | null> {
        return await prisma.cartItem.findUnique({
            where: {
                cartId_variantId: {
                    cartId,
                    variantId,
                },
            },
            include: cartItemInclude,
        });
    }

    // ============================
    // ADD OR INCREMENT CART ITEM
    // ============================

    async upsertItem(cartId: string, variantId: string, quantity: number): Promise<Prisma.CartItemGetPayload<{ include: typeof cartItemInclude }>> {
        return await prisma.cartItem.upsert({
            where: {
                cartId_variantId: {
                    cartId,
                    variantId,
                },
            },
            create: {
                cartId,
                variantId,
                quantity,
            },
            update: {
                quantity: {
                    increment: quantity,
                },
            },
            include: cartItemInclude,
        });
    }

    // ============================
    // UPDATE CART ITEM QUANTITY
    // ============================

    async updateItemQuantity(cartId: string, itemId: string, quantity: number): Promise<Prisma.BatchPayload> {
        return await prisma.cartItem.updateMany({
            where: {
                id: itemId,
                cartId,
            },
            data: {
                quantity,
            },
        });
    }

    // ============================
    // DELETE CART ITEM
    // ============================

    async deleteItem(cartId: string, itemId: string): Promise<Prisma.BatchPayload> {
        return await prisma.cartItem.deleteMany({
            where: {
                id: itemId,
                cartId,
            },
        });
    }

    // ============================
    // FIND PRODUCT VARIANT BY ID
    // ============================

    async findVariantById(variantId: string): Promise<Prisma.ProductVariantGetPayload<{
        include: { product: true; inventory: true; };
    }> | null> {

        return await prisma.productVariant.findUnique({
            where: { id: variantId },
            include: {
                product: true,
                inventory: true,
            },
        });
    }

    // ============================
    // MERGE GUEST CART INTO USER CART
    // ============================

    async mergeGuestCart(guestCartId: string, userCartId: string): Promise<Prisma.CartGetPayload<{ include: typeof cartInclude }> | null> {

        return await prisma.$transaction(async (tx) => {

            const guestItems = await tx.cartItem.findMany({
                where: {
                    cartId: guestCartId,
                },
            });

            for (const item of guestItems) {
                await tx.cartItem.upsert({
                    where: {
                        cartId_variantId: {
                            cartId: userCartId,
                            variantId: item.variantId,
                        },
                    },
                    create: {
                        cartId: userCartId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                    },
                    update: {
                        quantity: {
                            increment: item.quantity,
                        },
                    },
                });
            }

            await tx.cart.delete({
                where: {
                    id: guestCartId,
                },
            });

            return await tx.cart.findUnique({
                where: {
                    id: userCartId,
                },
                include: cartInclude,
            });
        });
    }

    // ============================
    // DELETE GUEST CART
    // ============================

    async deleteGuestCart(cartId: string, guestTokenHash: string): Promise<Prisma.BatchPayload> {
        return await prisma.cart.deleteMany({
            where: {
                id: cartId,
                guestTokenHash,
                userId: null,
            },
        });
    }

    // ============================
    // CLEAR CART
    // ============================

    async clearItems(cartId: string): Promise<Prisma.BatchPayload> {
        return await prisma.cartItem.deleteMany({
            where: { cartId },
        });
    }
}

// ============================
// EXPORT CART REPOSITORY
// ============================

export const cartRepository = new CartRepository();
