-- DropForeignKey
ALTER TABLE "Buttons" DROP CONSTRAINT "Buttons_keyboardId_fkey";

-- DropForeignKey
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_usersId_fkey";

-- DropForeignKey
ALTER TABLE "channels" DROP CONSTRAINT "channels_campaignsId_fkey";

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_campaignsId_fkey" FOREIGN KEY ("campaignsId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buttons" ADD CONSTRAINT "Buttons_keyboardId_fkey" FOREIGN KEY ("keyboardId") REFERENCES "Keyboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
