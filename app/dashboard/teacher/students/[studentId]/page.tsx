import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Award,
  BarChart3,
  Clock3,
  Medal,
  Puzzle,
  School,
  Trophy,
  Users
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function formatTime(ms: number | null | undefined) {
  if (!ms || ms <= 0) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export default async function TeacherStudentDetailPage({
  params
}: {
  params: { studentId: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  const memberships = await prisma.classroomMembership.findMany({
    where: {
      userId: params.studentId,
      classroom: {
        teacherId: session.user.id
      }
    },
    include: {
      classroom: {
        include: {
          school: true
        }
      },
      user: true
    },
    orderBy: {
      joinedAt: "desc"
    }
  });

  if (memberships.length === 0) {
    notFound();
  }

  const student = memberships[0].user;
  const classroomIds = memberships.map((membership) => membership.classroomId);

  const progressRows = await prisma.studentPuzzleProgress.findMany({
    where: {
      studentId: student.id,
      classroomId: {
        in: classroomIds
      }
    },
    include: {
      puzzle: true,
      classroom: true
    },
    orderBy: {
      updatedAt: "desc"
    }
  });

  const leaderboardRows = await prisma.puzzleLeaderboardEntry.findMany({
    where: {
      userId: student.id,
      classroomId: {
        in: classroomIds
      }
    },
    include: {
      puzzle: true,
      classroom: true
    },
    orderBy: {
      score: "desc"
    }
  });

  const totalPoints = progressRows.reduce((sum, row) => sum + row.totalPointsEarned, 0);
  const totalAttempts = progressRows.reduce((sum, row) => sum + row.attempts, 0);
  const completedCount = progressRows.filter((row) => row.isCompleted).length;
  const totalPlayMs = progressRows.reduce((sum, row) => sum + (row.bestTimeMs ?? 0), 0);
  const bestScore =
    progressRows
      .map((row) => row.bestScore)
      .filter((value): value is number => typeof value === "number")
      .sort((a, b) => b - a)[0] ?? null;
  const bestTime =
    progressRows
      .map((row) => row.bestTimeMs)
      .filter((value): value is number => typeof value === "number")
      .sort((a, b) => a - b)[0] ?? null;

  const puzzleRows = progressRows.map((row) => ({
    id: row.id,
    title: row.puzzle.title,
    classroomName: row.classroom?.name || "No classroom",
    completionPct: row.completionPct,
    isCompleted: row.isCompleted,
    attempts: row.attempts,
    bestScore: row.bestScore,
    bestTimeMs: row.bestTimeMs,
    totalPointsEarned: row.totalPointsEarned,
    lastWorkedAt: row.lastWorkedAt,
    completedAt: row.completedAt
  }));

  const byCompletionDesc = [...puzzleRows].sort((a, b) => b.completionPct - a.completionPct);
  const recentWork = [...puzzleRows]
    .filter((row) => row.lastWorkedAt)
    .sort(
      (a, b) =>
        (b.lastWorkedAt?.getTime() ?? 0) - (a.lastWorkedAt?.getTime() ?? 0)
    );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <Link href="/dashboard/teacher" className="inline-flex items-center gap-2 text-sm font-medium text-pickle-800 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to teacher dashboard
        </Link>
      </div>

      <section className="rounded-[2rem] border border-line bg-white p-8 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
              Student analytics
            </div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
              {student.displayName || student.firstName}
            </h1>
            <p className="mt-3 text-muted">{student.email}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
              {student.countryCode ? (
                <div className="rounded-full border border-line bg-white px-3 py-1">
                  {student.countryCode}
                </div>
              ) : null}
              {student.stateProvince ? (
                <div className="rounded-full border border-line bg-white px-3 py-1">
                  {student.stateProvince}
                </div>
              ) : null}
              {student.city ? (
                <div className="rounded-full border border-line bg-white px-3 py-1">
                  {student.city}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-pickle-200 bg-pickle-50 px-5 py-4 text-right">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-pickle-700">
              Classrooms with you
            </div>
            <div className="mt-2 text-2xl font-bold tracking-[0.04em] text-ink">
              {memberships.length}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <Award className="h-4 w-4" />
            Total points
          </div>
          <div className="mt-2 text-3xl font-semibold text-ink">{totalPoints}</div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <Puzzle className="h-4 w-4" />
            Puzzle completions
          </div>
          <div className="mt-2 text-3xl font-semibold text-ink">{completedCount}</div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <Activity className="h-4 w-4" />
            Total attempts
          </div>
          <div className="mt-2 text-3xl font-semibold text-ink">{totalAttempts}</div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <Clock3 className="h-4 w-4" />
            Tracked play time
          </div>
          <div className="mt-2 text-3xl font-semibold text-ink">{formatTime(totalPlayMs)}</div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink">Student overview</h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
              <BarChart3 className="h-4 w-4" />
              Snapshot
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-canvas p-4">
              <div className="text-sm font-medium text-muted">Best score</div>
              <div className="mt-2 text-2xl font-semibold text-ink">{bestScore ?? "—"}</div>
            </div>

            <div className="rounded-2xl border border-line bg-canvas p-4">
              <div className="text-sm font-medium text-muted">Fastest completion time</div>
              <div className="mt-2 text-2xl font-semibold text-ink">{formatTime(bestTime)}</div>
            </div>

            <div className="rounded-2xl border border-line bg-canvas p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted">
                <Users className="h-4 w-4" />
                Teacher classrooms
              </div>
              <div className="mt-2 text-sm text-ink">
                {memberships.map((membership) => membership.classroom.name).join(", ")}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-canvas p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted">
                <School className="h-4 w-4" />
                School
              </div>
              <div className="mt-2 text-sm text-ink">
                {memberships[0].classroom.school?.name || "No school"}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-line p-5">
            <div className="text-sm font-semibold text-ink">Growth direction</div>
            <p className="mt-2 text-sm leading-6 text-muted">
              This page is now ready to become the home for student growth charts, puzzle streaks, playtime trends,
              accomplishment badges, and classroom comparison views.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink">Puzzle progress</h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
              <Trophy className="h-4 w-4" />
              By completion
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {byCompletionDesc.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-6 text-muted">
                No tracked puzzle work yet for this student.
              </div>
            ) : (
              byCompletionDesc.map((row) => (
                <div key={row.id} className="rounded-2xl border border-line p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-ink">{row.title}</div>
                      <div className="mt-1 text-sm text-muted">{row.classroomName}</div>
                    </div>

                    <div className="text-right text-sm text-muted">
                      <div className="font-semibold text-ink">
                        {row.isCompleted ? "Completed" : `${row.completionPct}%`}
                      </div>
                      <div>{row.totalPointsEarned} points</div>
                    </div>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-pickle-500"
                      style={{ width: `${Math.max(4, row.completionPct)}%` }}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                    <div className="rounded-full border border-line px-3 py-1">
                      Attempts: {row.attempts}
                    </div>
                    <div className="rounded-full border border-line px-3 py-1">
                      Best score: {row.bestScore ?? "—"}
                    </div>
                    <div className="rounded-full border border-line px-3 py-1">
                      Best time: {formatTime(row.bestTimeMs)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink">Recent work</h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
              <Activity className="h-4 w-4" />
              Latest activity
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {recentWork.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-6 text-muted">
                No recent work recorded yet.
              </div>
            ) : (
              recentWork.slice(0, 8).map((row) => (
                <div key={row.id} className="rounded-2xl border border-line p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-ink">{row.title}</div>
                      <div className="mt-1 text-sm text-muted">
                        Last active {row.lastWorkedAt ? formatDate(row.lastWorkedAt) : "—"}
                      </div>
                    </div>

                    <div className="text-right text-sm text-muted">
                      <div>{row.totalPointsEarned} points</div>
                      <div>{row.isCompleted ? "Completed" : "In progress"}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink">Leaderboard-ready accomplishments</h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
              <Medal className="h-4 w-4" />
              Highest results
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {leaderboardRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-6 text-muted">
                No leaderboard entries yet for this student.
              </div>
            ) : (
              leaderboardRows.slice(0, 8).map((row) => (
                <div key={row.id} className="rounded-2xl border border-line p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-ink">{row.puzzle.title}</div>
                      <div className="mt-1 text-sm text-muted">
                        {row.classroom?.name || "No classroom"}
                      </div>
                    </div>

                    <div className="text-right text-sm text-muted">
                      <div className="font-semibold text-ink">{row.score} score</div>
                      <div>{formatTime(row.timeMs)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}