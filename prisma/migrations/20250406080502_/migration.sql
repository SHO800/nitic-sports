/*
  Warnings:

  - You are about to drop the column `rankings` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `team1Id` on the `MatchPlan` table. All the data in the column will be lost.
  - You are about to drop the column `team1Note` on the `MatchPlan` table. All the data in the column will be lost.
  - You are about to drop the column `team2Id` on the `MatchPlan` table. All the data in the column will be lost.
  - You are about to drop the column `team2Note` on the `MatchPlan` table. All the data in the column will be lost.
  - You are about to drop the column `team1Id` on the `MatchResult` table. All the data in the column will be lost.
  - You are about to drop the column `team1MatchScore` on the `MatchResult` table. All the data in the column will be lost.
  - You are about to drop the column `team2Id` on the `MatchResult` table. All the data in the column will be lost.
  - You are about to drop the column `team2MatchScore` on the `MatchResult` table. All the data in the column will be lost.
  - Made the column `winnerTeamId` on table `MatchResult` required. This step will fail if there are existing NULL values in that column.
  - Made the column `loserTeamId` on table `MatchResult` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "rankings",
ADD COLUMN     "teamData" JSONB[];

-- AlterTable
ALTER TABLE "MatchPlan" DROP COLUMN "team1Id",
DROP COLUMN "team1Note",
DROP COLUMN "team2Id",
DROP COLUMN "team2Note",
ADD COLUMN     "matchNote" TEXT,
ADD COLUMN     "matchSecretNote" TEXT,
ADD COLUMN     "teamIds" TEXT[],
ADD COLUMN     "teamNote" TEXT[];

-- AlterTable
ALTER TABLE "MatchResult" DROP COLUMN "team1Id",
DROP COLUMN "team1MatchScore",
DROP COLUMN "team2Id",
DROP COLUMN "team2MatchScore",
ADD COLUMN     "matchScores" TEXT[],
ADD COLUMN     "resultNote" TEXT,
ADD COLUMN     "resultSecretNote" TEXT,
ADD COLUMN     "teamIds" TEXT[],
ALTER COLUMN "winnerTeamId" SET NOT NULL,
ALTER COLUMN "loserTeamId" SET NOT NULL;
