/*
  Warnings:

  - You are about to drop the column `productId` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `variantId` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropIndex
DROP INDEX "ProductImage_productId_idx";

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "productId",
ADD COLUMN     "variantId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ProductImage_variantId_idx" ON "ProductImage"("variantId");

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
