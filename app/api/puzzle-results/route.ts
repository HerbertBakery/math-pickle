import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type PuzzleResultPayload = {
  puzzleSlug?: string;
  puzzleVariantSlug?: string | null;
  classroomId?: string | null;
  assignmentId?: string | null;
  score?: number | null;
  timeMs?: number | null;
  attempts?: number | null;
  completed?: boolean | null;
  completionPct?: number | null;
};

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as PuzzleResultPayload;

  const puzzleSlug = String(body.puzzleSlug || "").trim();
  const puzzleVariantSlug = body.puzzleVariantSlug ? String(body.puzzleVariantSlug).trim() : null;
  const classroomId = body.classroomId ? String(body.classroomId).trim() : null;
  const assignmentId = body.assignmentId ? String(body.assignmentId).trim() : null;

  if (!puzzleSlug) {
    return NextResponse.json({ error: "Missing puzzleSlug" }, { status: 400 });
  }

  const puzzle = await prisma.puzzle.findUnique({
    where: { slug: puzzleSlug }
  });

  if (!puzzle) {
    return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
  }

  if (session.user.role === "STUDENT" && classroomId) {
    const membership = await prisma.classroomMembership.findFirst({
      where: {
        classroomId,
        userId: session.user.id
      }
    });

    if (!membership) {
      return NextResponse.json({ error: "Student is not in this classroom" }, { status: 403 });
    }
  }

  const assignment = assignmentId
    ? await prisma.classroomAssignment.findFirst({
        where: {
          id: assignmentId,
          puzzleId: puzzle.id,
          ...(classroomId ? { classroomId } : {})
        },
        select: {
          id: true,
          classroomId: true,
          puzzleVariantId: true
        }
      })
    : null;

  if (assignmentId && !assignment) {
    return NextResponse.json(
      { error: "Assignment not found or does not match puzzle/classroom" },
      { status: 400 }
    );
  }

  const puzzleVariant =
    assignment?.puzzleVariantId
      ? await prisma.puzzleVariant.findUnique({
          where: {
            id: assignment.puzzleVariantId
          }
        })
      : puzzleVariantSlug
        ? await prisma.puzzleVariant.findUnique({
            where: {
              puzzleId_slug: {
                puzzleId: puzzle.id,
                slug: puzzleVariantSlug
              }
            }
          })
        : await prisma.puzzleVariant.findFirst({
            where: {
              puzzleId: puzzle.id,
              isOfficial: true,
              leaderboardEnabled: true
            },
            orderBy: {
              title: "asc"
            }
          });

  if (!puzzleVariant) {
    return NextResponse.json({ error: "Puzzle variant not found" }, { status: 400 });
  }

  const score = Number.isFinite(body.score) ? Math.max(0, Math.floor(body.score as number)) : null;
  const timeMs = Number.isFinite(body.timeMs) ? Math.max(0, Math.floor(body.timeMs as number)) : null;
  const attempts = Number.isFinite(body.attempts) ? Math.max(0, Math.floor(body.attempts as number)) : 1;
  const completed = Boolean(body.completed);
  const completionPct = Number.isFinite(body.completionPct)
    ? Math.max(0, Math.min(100, Math.floor(body.completionPct as number)))
    : completed
      ? 100
      : 0;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      schoolId: true,
      countryCode: true,
      stateProvince: true
    }
  });

  const effectiveClassroomId = assignment?.classroomId ?? classroomId ?? null;
  const now = new Date();

  const existingProgress = await prisma.studentPuzzleProgress.findUnique({
    where: {
      studentId_puzzleId_puzzleVariantId: {
        studentId: session.user.id,
        puzzleId: puzzle.id,
        puzzleVariantId: puzzleVariant.id
      }
    }
  });

  await prisma.studentPuzzleProgress.upsert({
    where: {
      studentId_puzzleId_puzzleVariantId: {
        studentId: session.user.id,
        puzzleId: puzzle.id,
        puzzleVariantId: puzzleVariant.id
      }
    },
    update: {
      classroomId: effectiveClassroomId,
      completionPct: Math.max(existingProgress?.completionPct ?? 0, completionPct),
      isCompleted: existingProgress?.isCompleted ? true : completed,
      attempts: (existingProgress?.attempts ?? 0) + Math.max(1, attempts),
      bestScore:
        score === null
          ? existingProgress?.bestScore ?? null
          : existingProgress?.bestScore === null || existingProgress?.bestScore === undefined
            ? score
            : puzzleVariant.scoreDirection === "LOWER_BETTER" && puzzleVariant.primaryMetricLabel !== "Time"
              ? Math.min(existingProgress.bestScore, score)
              : Math.max(existingProgress.bestScore, score),
      bestTimeMs:
        timeMs === null
          ? existingProgress?.bestTimeMs ?? null
          : existingProgress?.bestTimeMs === null || existingProgress?.bestTimeMs === undefined
            ? timeMs
            : Math.min(existingProgress.bestTimeMs, timeMs),
      totalPointsEarned: (existingProgress?.totalPointsEarned ?? 0) + (score ?? 0),
      lastWorkedAt: now,
      completedAt: completed ? now : existingProgress?.completedAt ?? null
    },
    create: {
      studentId: session.user.id,
      puzzleId: puzzle.id,
      puzzleVariantId: puzzleVariant.id,
      classroomId: effectiveClassroomId,
      completionPct,
      isCompleted: completed,
      attempts: Math.max(1, attempts),
      bestScore: score,
      bestTimeMs: timeMs,
      totalPointsEarned: score ?? 0,
      lastWorkedAt: now,
      completedAt: completed ? now : null
    }
  });

  const existingLeaderboard = await prisma.puzzleLeaderboardEntry.findUnique({
    where: {
      puzzleId_puzzleVariantId_userId: {
        puzzleId: puzzle.id,
        puzzleVariantId: puzzleVariant.id,
        userId: session.user.id
      }
    }
  });

  await prisma.puzzleLeaderboardEntry.upsert({
    where: {
      puzzleId_puzzleVariantId_userId: {
        puzzleId: puzzle.id,
        puzzleVariantId: puzzleVariant.id,
        userId: session.user.id
      }
    },
    update: {
      classroomId: effectiveClassroomId,
      schoolId: user?.schoolId ?? null,
      countryCode: user?.countryCode ?? null,
      stateProvince: user?.stateProvince ?? null,
      score:
        score === null
          ? existingLeaderboard?.score ?? 0
          : existingLeaderboard?.score === null || existingLeaderboard?.score === undefined
            ? score
            : puzzleVariant.scoreDirection === "LOWER_BETTER" && puzzleVariant.primaryMetricLabel !== "Time"
              ? Math.min(existingLeaderboard.score, score)
              : Math.max(existingLeaderboard.score, score),
      timeMs:
        timeMs === null
          ? existingLeaderboard?.timeMs ?? null
          : existingLeaderboard?.timeMs === null || existingLeaderboard?.timeMs === undefined
            ? timeMs
            : Math.min(existingLeaderboard.timeMs, timeMs),
      attempts: (existingLeaderboard?.attempts ?? 0) + Math.max(1, attempts),
      completedAt: completed ? now : existingLeaderboard?.completedAt ?? null
    },
    create: {
      puzzleId: puzzle.id,
      puzzleVariantId: puzzleVariant.id,
      userId: session.user.id,
      classroomId: effectiveClassroomId,
      schoolId: user?.schoolId ?? null,
      countryCode: user?.countryCode ?? null,
      stateProvince: user?.stateProvince ?? null,
      score: score ?? 0,
      timeMs,
      attempts: Math.max(1, attempts),
      completedAt: completed ? now : null
    }
  });

  return NextResponse.json({
    ok: true,
    saved: {
      puzzleSlug,
      puzzleVariantSlug: puzzleVariant.slug,
      classroomId: effectiveClassroomId,
      assignmentId: assignment?.id ?? null,
      score,
      timeMs,
      attempts,
      completed,
      completionPct
    }
  });
}