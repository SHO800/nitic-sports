/*
  Warnings:

  - The values [waiting,preparing,playing,finished,completed,cancelled] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('Waiting', 'Preparing', 'Playing', 'Finished', 'Completed', 'Cancelled');
ALTER TABLE "MatchPlan" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "MatchPlan" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "MatchPlan" ALTER COLUMN "status" SET DEFAULT 'Waiting';
COMMIT;

-- AlterTable
ALTER TABLE "MatchPlan" ALTER COLUMN "status" SET DEFAULT 'Waiting';
