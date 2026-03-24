/*
  Warnings:

  - A unique constraint covering the columns `[puzzleId,puzzleVariantId,userId]` on the table `PuzzleLeaderboardEntry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,countryCode,stateProvince,city]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,puzzleId,puzzleVariantId]` on the table `StudentPuzzleProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PuzzleScoreDirection" AS ENUM ('HIGHER_BETTER', 'LOWER_BETTER');

-- DropIndex
DROP INDEX "PuzzleLeaderboardEntry_puzzleId_classroomId_score_idx";

-- DropIndex
DROP INDEX "PuzzleLeaderboardEntry_puzzleId_countryCode_score_idx";

-- DropIndex
DROP INDEX "PuzzleLeaderboardEntry_puzzleId_schoolId_score_idx";

-- DropIndex
DROP INDEX "PuzzleLeaderboardEntry_puzzleId_userId_key";

-- DropIndex
DROP INDEX "School_name_countryCode_key";

-- DropIndex
DROP INDEX "StudentPuzzleProgress_studentId_puzzleId_key";

-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "city" TEXT,
ADD COLUMN     "stateProvince" TEXT;

-- AlterTable
ALTER TABLE "OverallLeaderboardEntry" ADD COLUMN     "stateProvince" TEXT;

-- AlterTable
ALTER TABLE "PuzzleLeaderboardEntry" ADD COLUMN     "puzzleVariantId" TEXT,
ADD COLUMN     "stateProvince" TEXT;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "stateProvince" TEXT;

-- AlterTable
ALTER TABLE "StudentPuzzleProgress" ADD COLUMN     "puzzleVariantId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "stateProvince" TEXT;

-- CreateTable
CREATE TABLE "PuzzleVariant" (
    "id" TEXT NOT NULL,
    "puzzleId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isOfficial" BOOLEAN NOT NULL DEFAULT true,
    "leaderboardEnabled" BOOLEAN NOT NULL DEFAULT true,
    "scoreDirection" "PuzzleScoreDirection" NOT NULL DEFAULT 'HIGHER_BETTER',
    "primaryMetricLabel" TEXT NOT NULL DEFAULT 'Score',
    "secondaryMetricLabel" TEXT,
    "configJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PuzzleVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PuzzleVariant_puzzleId_idx" ON "PuzzleVariant"("puzzleId");

-- CreateIndex
CREATE INDEX "PuzzleVariant_isOfficial_leaderboardEnabled_idx" ON "PuzzleVariant"("isOfficial", "leaderboardEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "PuzzleVariant_puzzleId_slug_key" ON "PuzzleVariant"("puzzleId", "slug");

-- CreateIndex
CREATE INDEX "Classroom_stateProvince_idx" ON "Classroom"("stateProvince");

-- CreateIndex
CREATE INDEX "OverallLeaderboardEntry_stateProvince_totalPoints_idx" ON "OverallLeaderboardEntry"("stateProvince", "totalPoints");

-- CreateIndex
CREATE INDEX "PuzzleLeaderboardEntry_puzzleId_puzzleVariantId_score_idx" ON "PuzzleLeaderboardEntry"("puzzleId", "puzzleVariantId", "score");

-- CreateIndex
CREATE INDEX "PuzzleLeaderboardEntry_puzzleId_puzzleVariantId_classroomId_idx" ON "PuzzleLeaderboardEntry"("puzzleId", "puzzleVariantId", "classroomId", "score");

-- CreateIndex
CREATE INDEX "PuzzleLeaderboardEntry_puzzleId_puzzleVariantId_schoolId_sc_idx" ON "PuzzleLeaderboardEntry"("puzzleId", "puzzleVariantId", "schoolId", "score");

-- CreateIndex
CREATE INDEX "PuzzleLeaderboardEntry_puzzleId_puzzleVariantId_countryCode_idx" ON "PuzzleLeaderboardEntry"("puzzleId", "puzzleVariantId", "countryCode", "score");

-- CreateIndex
CREATE INDEX "PuzzleLeaderboardEntry_puzzleId_puzzleVariantId_stateProvin_idx" ON "PuzzleLeaderboardEntry"("puzzleId", "puzzleVariantId", "stateProvince", "score");

-- CreateIndex
CREATE UNIQUE INDEX "PuzzleLeaderboardEntry_puzzleId_puzzleVariantId_userId_key" ON "PuzzleLeaderboardEntry"("puzzleId", "puzzleVariantId", "userId");

-- CreateIndex
CREATE INDEX "School_stateProvince_idx" ON "School"("stateProvince");

-- CreateIndex
CREATE UNIQUE INDEX "School_name_countryCode_stateProvince_city_key" ON "School"("name", "countryCode", "stateProvince", "city");

-- CreateIndex
CREATE INDEX "StudentPuzzleProgress_puzzleVariantId_idx" ON "StudentPuzzleProgress"("puzzleVariantId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentPuzzleProgress_studentId_puzzleId_puzzleVariantId_key" ON "StudentPuzzleProgress"("studentId", "puzzleId", "puzzleVariantId");

-- CreateIndex
CREATE INDEX "User_stateProvince_idx" ON "User"("stateProvince");

-- AddForeignKey
ALTER TABLE "PuzzleVariant" ADD CONSTRAINT "PuzzleVariant_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPuzzleProgress" ADD CONSTRAINT "StudentPuzzleProgress_puzzleVariantId_fkey" FOREIGN KEY ("puzzleVariantId") REFERENCES "PuzzleVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuzzleLeaderboardEntry" ADD CONSTRAINT "PuzzleLeaderboardEntry_puzzleVariantId_fkey" FOREIGN KEY ("puzzleVariantId") REFERENCES "PuzzleVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
