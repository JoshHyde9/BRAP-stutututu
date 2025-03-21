-- CreateEnum
CREATE TYPE "friend_request" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "friend" (
    "id" TEXT NOT NULL,
    "status" "friend_request" NOT NULL DEFAULT 'PENDING',
    "requesterId" TEXT NOT NULL,
    "addresseeId" TEXT NOT NULL,

    CONSTRAINT "friend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "friend_requesterId_addresseeId_key" ON "friend"("requesterId", "addresseeId");

-- AddForeignKey
ALTER TABLE "friend" ADD CONSTRAINT "friend_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend" ADD CONSTRAINT "friend_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
