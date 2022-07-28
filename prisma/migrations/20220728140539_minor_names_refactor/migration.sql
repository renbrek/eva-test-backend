/*
  Warnings:

  - You are about to drop the column `usersId` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `campaignsId` on the `channels` table. All the data in the column will be lost.
  - Added the required column `userId` to the `campaigns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaignId` to the `channels` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_usersId_fkey";

-- DropForeignKey
ALTER TABLE "channels" DROP CONSTRAINT "channels_campaignsId_fkey";

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "usersId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "channels" DROP COLUMN "campaignsId",
ADD COLUMN     "campaignId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
