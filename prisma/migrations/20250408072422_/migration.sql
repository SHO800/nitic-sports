/*
  Warnings:

  - The `teamIds` column on the `MatchResult` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MatchResult" DROP COLUMN "teamIds",
ADD COLUMN     "teamIds" INTEGER[];
