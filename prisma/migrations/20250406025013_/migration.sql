/*
  Warnings:

  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_locationId_fkey";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "color1" TEXT;

-- DropTable
DROP TABLE "Match";

-- CreateTable
CREATE TABLE "MatchPlan" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "team1Id" INTEGER,
    "team2Id" INTEGER,
    "team1Note" TEXT,
    "team2Note" TEXT,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "scheduledStartTime" TEXT NOT NULL,
    "scheduledEndTime" TEXT NOT NULL,
    "locationId" INTEGER,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MatchPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchResult" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "team1Id" INTEGER,
    "team2Id" INTEGER,
    "winnerTeamId" INTEGER,
    "loserTeamId" INTEGER,
    "isCanceled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MatchResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MatchPlan" ADD CONSTRAINT "MatchPlan_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlan" ADD CONSTRAINT "MatchPlan_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "MatchPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
