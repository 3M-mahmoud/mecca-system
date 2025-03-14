/*
  Warnings:

  - You are about to drop the column `traderId` on the `Supply` table. All the data in the column will be lost.
  - Added the required column `description` to the `Supply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Withdrawal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Supply" DROP CONSTRAINT "Supply_traderId_fkey";

-- AlterTable
ALTER TABLE "Supply" DROP COLUMN "traderId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "supplier" TEXT,
ADD COLUMN     "traderCustomerId" INTEGER;

-- AlterTable
ALTER TABLE "Withdrawal" ADD COLUMN     "description" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Supply" ADD CONSTRAINT "Supply_traderCustomerId_fkey" FOREIGN KEY ("traderCustomerId") REFERENCES "TraderCustomer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
