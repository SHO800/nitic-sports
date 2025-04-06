/*
  Warnings:

  - You are about to drop the column `teamNote` on the `MatchPlan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matchId]` on the table `MatchResult` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MatchPlan" DROP COLUMN "teamNote",
ADD COLUMN     "matchResultId" INTEGER,
ADD COLUMN     "teamNotes" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "MatchResult_matchId_key" ON "MatchResult"("matchId");
