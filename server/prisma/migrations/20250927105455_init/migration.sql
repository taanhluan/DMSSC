/*
  Warnings:

  - Added the required column `sr` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "hours" INTEGER DEFAULT 0,
ADD COLUMN     "pic" TEXT,
ADD COLUMN     "priority" TEXT,
ADD COLUMN     "site" TEXT,
ADD COLUMN     "sr" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3),
ALTER COLUMN "title" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Backlog" (
    "id" TEXT NOT NULL,
    "site" TEXT,
    "sr" TEXT NOT NULL,
    "description" TEXT,
    "owner" TEXT,
    "priority" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "onOff" TEXT DEFAULT 'ON',
    "progress" INTEGER DEFAULT 0,
    "complex" TEXT,
    "tracks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Backlog_pkey" PRIMARY KEY ("id")
);
