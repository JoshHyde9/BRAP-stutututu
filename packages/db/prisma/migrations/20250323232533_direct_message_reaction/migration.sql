-- CreateTable
CREATE TABLE "direct_message_reaction" (
    "id" TEXT NOT NULL,
    "directMessageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "direct_message_reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "direct_message_reaction_userId_idx" ON "direct_message_reaction"("userId");

-- CreateIndex
CREATE INDEX "direct_message_reaction_directMessageId_idx" ON "direct_message_reaction"("directMessageId");

-- AddForeignKey
ALTER TABLE "direct_message_reaction" ADD CONSTRAINT "direct_message_reaction_directMessageId_fkey" FOREIGN KEY ("directMessageId") REFERENCES "direct_message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_message_reaction" ADD CONSTRAINT "direct_message_reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
