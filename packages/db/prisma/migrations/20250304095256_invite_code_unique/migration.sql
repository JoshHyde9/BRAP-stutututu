/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `server` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "server_inviteCode_key" ON "server"("inviteCode");
