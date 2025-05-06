/*
  Warnings:

  - You are about to drop the column `color1` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "color1",
ADD COLUMN     "color" TEXT;
