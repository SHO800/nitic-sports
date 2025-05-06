/*
  Warnings:

  - You are about to drop the `EventSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduleImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ScheduleImage" DROP CONSTRAINT "ScheduleImage_eventScheduleId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "EventSchedule";

-- DropTable
DROP TABLE "ScheduleImage";
