-- CreateTable
CREATE TABLE "ban" (
    "id" TEXT NOT NULL,
    "reason" TEXT,
    "userId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ban_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ban_userId_idx" ON "ban"("userId");

-- CreateIndex
CREATE INDEX "ban_serverId_idx" ON "ban"("serverId");

-- AddForeignKey
ALTER TABLE "ban" ADD CONSTRAINT "ban_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ban" ADD CONSTRAINT "ban_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
