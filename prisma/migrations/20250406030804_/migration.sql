/*
  Warnings:

  - You are about to drop the column `matchDate` on the `MatchPlan` table. All the data in the column will be lost.
  - Changed the type of `scheduledStartTime` on the `MatchPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `scheduledEndTime` on the `MatchPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startTime` on the `ScheduleImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `ScheduleImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MatchPlan" DROP COLUMN "matchDate",
DROP COLUMN "scheduledStartTime",
ADD COLUMN     "scheduledStartTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "scheduledEndTime",
ADD COLUMN     "scheduledEndTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MatchResult" ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "team1MatchScore" INTEGER,
ADD COLUMN     "team2MatchScore" INTEGER;

-- AlterTable
ALTER TABLE "ScheduleImage" DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL;
