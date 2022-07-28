/*
  Warnings:

  - You are about to drop the `Buttons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Keyboard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Buttons" DROP CONSTRAINT "Buttons_keyboardId_fkey";

-- DropForeignKey
ALTER TABLE "Keyboard" DROP CONSTRAINT "Keyboard_channelId_fkey";

-- DropTable
DROP TABLE "Buttons";

-- DropTable
DROP TABLE "Keyboard";

-- CreateTable
CREATE TABLE "keyboard" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "keyboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buttons" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isInlineButton" BOOLEAN NOT NULL,
    "isLinkButton" BOOLEAN NOT NULL,
    "text" TEXT NOT NULL,
    "link" TEXT,
    "keyboardId" TEXT NOT NULL,

    CONSTRAINT "buttons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "keyboard_channelId_key" ON "keyboard"("channelId");

-- AddForeignKey
ALTER TABLE "keyboard" ADD CONSTRAINT "keyboard_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buttons" ADD CONSTRAINT "buttons_keyboardId_fkey" FOREIGN KEY ("keyboardId") REFERENCES "keyboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
