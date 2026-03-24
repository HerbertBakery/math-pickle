-- AlterTable
ALTER TABLE "ClassroomAssignment" ADD COLUMN     "puzzleVariantId" TEXT;

-- CreateIndex
CREATE INDEX "ClassroomAssignment_puzzleVariantId_idx" ON "ClassroomAssignment"("puzzleVariantId");

-- AddForeignKey
ALTER TABLE "ClassroomAssignment" ADD CONSTRAINT "ClassroomAssignment_puzzleVariantId_fkey" FOREIGN KEY ("puzzleVariantId") REFERENCES "PuzzleVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
