/*
  Warnings:

  - You are about to drop the column `supplier` on the `Supply` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Supply" DROP CONSTRAINT "Supply_productId_fkey";

-- AlterTable
ALTER TABLE "Supply" DROP COLUMN "supplier",
ALTER COLUMN "productId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Supply" ADD CONSTRAINT "Supply_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
