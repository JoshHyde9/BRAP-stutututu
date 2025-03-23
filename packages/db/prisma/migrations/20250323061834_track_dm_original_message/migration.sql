/*
  Warnings:

  - Added the required column `originalContent` to the `direct_message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "direct_message" ADD COLUMN     "originalContent" TEXT NOT NULL;
