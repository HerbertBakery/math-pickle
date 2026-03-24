-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');

-- CreateEnum
CREATE TYPE "PuzzleType" AS ENUM ('PUZZLE', 'GAME', 'MINI_COMPETITION', 'UNSOLVED_PROBLEM', 'INTERACTIVE');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ClassroomMembershipRole" AS ENUM ('STUDENT', 'ASSISTANT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "displayName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "countryCode" TEXT,
    "schoolId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "countryCode" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "joinCode" TEXT NOT NULL,
    "gradeLabel" TEXT,
    "subjectLabel" TEXT,
    "countryCode" TEXT,
    "schoolId" TEXT,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomMembership" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ClassroomMembershipRole" NOT NULL DEFAULT 'STUDENT',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassroomMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Puzzle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT,
    "gradeBand" TEXT,
    "subject" TEXT,
    "standards" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "type" "PuzzleType" NOT NULL DEFAULT 'PUZZLE',
    "estimatedMins" INTEGER,
    "sourceLegacyUrl" TEXT,
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Puzzle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomAssignment" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "puzzleId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "titleOverride" TEXT,
    "instructions" TEXT,
    "dueAt" TIMESTAMP(3),
    "status" "AssignmentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassroomAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentPuzzleProgress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "puzzleId" TEXT NOT NULL,
    "classroomId" TEXT,
    "completionPct" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "bestScore" INTEGER,
    "bestTimeMs" INTEGER,
    "totalPointsEarned" INTEGER NOT NULL DEFAULT 0,
    "lastWorkedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentPuzzleProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuzzleLeaderboardEntry" (
    "id" TEXT NOT NULL,
    "puzzleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classroomId" TEXT,
    "schoolId" TEXT,
    "countryCode" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "timeMs" INTEGER,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PuzzleLeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OverallLeaderboardEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "classroomId" TEXT,
    "schoolId" TEXT,
    "countryCode" TEXT,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "totalCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalAttempts" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OverallLeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_schoolId_idx" ON "User"("schoolId");

-- CreateIndex
CREATE INDEX "User_countryCode_idx" ON "User"("countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");

-- CreateIndex
CREATE INDEX "School_countryCode_idx" ON "School"("countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "School_name_countryCode_key" ON "School"("name", "countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_slug_key" ON "Classroom"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_joinCode_key" ON "Classroom"("joinCode");

-- CreateIndex
CREATE INDEX "Classroom_teacherId_idx" ON "Classroom"("teacherId");

-- CreateIndex
CREATE INDEX "Classroom_schoolId_idx" ON "Classroom"("schoolId");

-- CreateIndex
CREATE INDEX "Classroom_countryCode_idx" ON "Classroom"("countryCode");

-- CreateIndex
CREATE INDEX "ClassroomMembership_userId_idx" ON "ClassroomMembership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomMembership_classroomId_userId_key" ON "ClassroomMembership"("classroomId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Puzzle_slug_key" ON "Puzzle"("slug");

-- CreateIndex
CREATE INDEX "Puzzle_type_idx" ON "Puzzle"("type");

-- CreateIndex
CREATE INDEX "Puzzle_featured_idx" ON "Puzzle"("featured");

-- CreateIndex
CREATE INDEX "Puzzle_gradeBand_idx" ON "Puzzle"("gradeBand");

-- CreateIndex
CREATE INDEX "Puzzle_subject_idx" ON "Puzzle"("subject");

-- CreateIndex
CREATE INDEX "ClassroomAssignment_classroomId_idx" ON "ClassroomAssignment"("classroomId");

-- CreateIndex
CREATE INDEX "ClassroomAssignment_puzzleId_idx" ON "ClassroomAssignment"("puzzleId");

-- CreateIndex
CREATE INDEX "ClassroomAssignment_createdById_idx" ON "ClassroomAssignment"("createdById");

-- CreateIndex
CREATE INDEX "ClassroomAssignment_status_idx" ON "ClassroomAssignment"("status");

-- CreateIndex
CREATE INDEX "StudentPuzzleProgress_studentId_idx" ON "StudentPuzzleProgress"("studentId");

-- CreateIndex
CREATE INDEX "StudentPuzzleProgress_puzzleId_idx" ON "StudentPuzzleProgress"("puzzleId");

-- CreateIndex
CREATE INDEX "StudentPuzzleProgress_classroomId_idx" ON "StudentPuzzleProgress"("classroomId");

-- CreateIndex
CREATE INDEX "StudentPuzzleProgress_isCompleted_idx" ON "StudentPuzzleProgress"("isCompleted");

-- CreateIndex
CREATE INDEX "StudentPuzzleProgress_completedAt_idx" ON "StudentPuzzleProgress"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StudentPuzzleProgress_studentId_puzzleId_key" ON "StudentPuzzleProgress"("studentId", "puzzleId");

-- CreateIndex
CREATE INDEX "PuzzleLeaderboardEntry_puzzleId_score_idx" ON "PuzzleLeaderboardEntry"("puzzleId", "score");

-- CreateIndex
CREATE INDEX "PuzzleLeaderboardEntry_puzzleId_classroomId_score_idx" ON "PuzzleLeaderboardEntry"("puzzleId", "classroomId", "score");

-- CreateIndex
CREATE INDEX "PuzzleLeaderboardEntry_puzzleId_schoolId_score_idx" ON "PuzzleLeaderboardEntry"("puzzleId", "schoolId", "score");

-- CreateIndex
CREATE INDEX "PuzzleLeaderboardEntry_puzzleId_countryCode_score_idx" ON "PuzzleLeaderboardEntry"("puzzleId", "countryCode", "score");

-- CreateIndex
CREATE INDEX "PuzzleLeaderboardEntry_completedAt_idx" ON "PuzzleLeaderboardEntry"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PuzzleLeaderboardEntry_puzzleId_userId_key" ON "PuzzleLeaderboardEntry"("puzzleId", "userId");

-- CreateIndex
CREATE INDEX "OverallLeaderboardEntry_countryCode_totalPoints_idx" ON "OverallLeaderboardEntry"("countryCode", "totalPoints");

-- CreateIndex
CREATE INDEX "OverallLeaderboardEntry_totalPoints_idx" ON "OverallLeaderboardEntry"("totalPoints");

-- CreateIndex
CREATE UNIQUE INDEX "OverallLeaderboardEntry_userId_key" ON "OverallLeaderboardEntry"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OverallLeaderboardEntry_classroomId_key" ON "OverallLeaderboardEntry"("classroomId");

-- CreateIndex
CREATE UNIQUE INDEX "OverallLeaderboardEntry_schoolId_key" ON "OverallLeaderboardEntry"("schoolId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomMembership" ADD CONSTRAINT "ClassroomMembership_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomMembership" ADD CONSTRAINT "ClassroomMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomAssignment" ADD CONSTRAINT "ClassroomAssignment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomAssignment" ADD CONSTRAINT "ClassroomAssignment_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomAssignment" ADD CONSTRAINT "ClassroomAssignment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPuzzleProgress" ADD CONSTRAINT "StudentPuzzleProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPuzzleProgress" ADD CONSTRAINT "StudentPuzzleProgress_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPuzzleProgress" ADD CONSTRAINT "StudentPuzzleProgress_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuzzleLeaderboardEntry" ADD CONSTRAINT "PuzzleLeaderboardEntry_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuzzleLeaderboardEntry" ADD CONSTRAINT "PuzzleLeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuzzleLeaderboardEntry" ADD CONSTRAINT "PuzzleLeaderboardEntry_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuzzleLeaderboardEntry" ADD CONSTRAINT "PuzzleLeaderboardEntry_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OverallLeaderboardEntry" ADD CONSTRAINT "OverallLeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OverallLeaderboardEntry" ADD CONSTRAINT "OverallLeaderboardEntry_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OverallLeaderboardEntry" ADD CONSTRAINT "OverallLeaderboardEntry_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
