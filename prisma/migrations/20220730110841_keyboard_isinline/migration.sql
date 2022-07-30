/*
  Warnings:

  - You are about to drop the column `userId` on the `campaigns` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `campaigns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isInline` to the `keyboard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_userId_fkey";

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "keyboard" ADD COLUMN     "isInline" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
