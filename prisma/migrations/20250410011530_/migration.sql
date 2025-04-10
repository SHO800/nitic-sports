/*
  Warnings:

  - You are about to drop the column `cancelNote` on the `MatchResult` table. All the data in the column will be lost.
  - You are about to drop the column `endedAt` on the `MatchResult` table. All the data in the column will be lost.
  - You are about to drop the column `isCanceled` on the `MatchResult` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `MatchResult` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('waiting', 'preparing', 'playing', 'finished', 'completed', 'cancelled');

-- AlterTable
ALTER TABLE "MatchPlan" ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'waiting';

-- AlterTable
ALTER TABLE "MatchResult" DROP COLUMN "cancelNote",
DROP COLUMN "endedAt",
DROP COLUMN "isCanceled",
DROP COLUMN "startedAt";
