-- CreateTable
CREATE TABLE "pinned_message" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pinned_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pinned_message_messageId_key" ON "pinned_message"("messageId");

-- CreateIndex
CREATE INDEX "pinned_message_messageId_idx" ON "pinned_message"("messageId");

-- AddForeignKey
ALTER TABLE "pinned_message" ADD CONSTRAINT "pinned_message_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
