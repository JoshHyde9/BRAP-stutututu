/*
  Warnings:

  - Added the required column `channelId` to the `pinned_message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pinned_message" ADD COLUMN     "channelId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "pinned_message_channelId_idx" ON "pinned_message"("channelId");

-- AddForeignKey
ALTER TABLE "pinned_message" ADD CONSTRAINT "pinned_message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
