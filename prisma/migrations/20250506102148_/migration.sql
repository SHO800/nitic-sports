-- AlterTable
ALTER TABLE "MatchPlan" ADD COLUMN     "is3rdPlaceMatch" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFinal" BOOLEAN NOT NULL DEFAULT false;
