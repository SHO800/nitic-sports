/*
  Warnings:

  - The primary key for the `MatchResult` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MatchResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MatchResult" DROP CONSTRAINT "MatchResult_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "MatchResult_pkey" PRIMARY KEY ("matchId");
