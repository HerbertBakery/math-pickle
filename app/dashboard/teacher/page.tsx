import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Medal,
  School,
  Sparkles,
  Timer,
  Trophy,
  Users
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-CA").format(value);
}

function formatTime(ms: number | null | undefined) {
  if (!ms || ms <= 0) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export default async function TeacherDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  const classrooms = await prisma.classroom.findMany({
    where: {
      teacherId: session.user.id
    },
    include: {
      school: true,
      memberships: {
        include: {
          user: true
        }
      },
      assignments: {
        include: {
          puzzle: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const classroomIds = classrooms.map((classroom) => classroom.id);
  const studentIds = Array.from(
    new Set(
      classrooms.flatMap((classroom) =>
        classroom.memberships.map((membership) => membership.userId)
      )
    )
  );

  const progressRows =
    classroomIds.length > 0
      ? await prisma.studentPuzzleProgress.findMany({
          where: {
            classroomId: {
              in: classroomIds
            }
          },
          include: {
            student: true,
            puzzle: true,
            classroom: true
          },
          orderBy: {
            updatedAt: "desc"
          }
        })
      : [];

  const publishedAssignments = classrooms.reduce(
    (sum, classroom) =>
      sum +
      classroom.assignments.filter((assignment) => assignment.status === "PUBLISHED").length,
    0
  );

  const completedRows = progressRows.filter((row) => row.isCompleted);
  const totalPlayTimeMs = progressRows.reduce(
    (sum, row) => sum + (row.bestTimeMs ?? 0),
    0
  );

  const studentSummaries = studentIds
    .map((studentId) => {
      const studentProgress = progressRows.filter((row) => row.studentId === studentId);
      const student = studentProgress[0]?.student ?? classrooms
        .flatMap((classroom) => classroom.memberships)
        .find((membership) => membership.userId === studentId)?.user;

      return {
        studentId,
        studentName:
          student?.displayName ||
          student?.firstName ||
          "Student",
        completedCount: studentProgress.filter((row) => row.isCompleted).length,
        totalPoints: studentProgress.reduce((sum, row) => sum + row.totalPointsEarned, 0),
        totalAttempts: studentProgress.reduce((sum, row) => sum + row.attempts, 0),
        bestTimeMs:
          studentProgress
            .map((row) => row.bestTimeMs)
            .filter((value): value is number => typeof value === "number")
            .sort((a, b) => a - b)[0] ?? null
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  const topStudents = studentSummaries.slice(0, 5);
  const recentActivity = progressRows.slice(0, 8);

  const teacherSchool = classrooms[0]?.school;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
            Teacher dashboard
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
            Welcome back{session.user.name ? `, ${session.user.name}` : ""}
          </h1>
          <p className="mt-3 max-w-3xl text-muted">
            Track your classrooms, monitor student performance, and build toward class, school, provincial or state, country, and global competition.
          </p>

          {teacherSchool ? (
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1">
                <School className="h-4 w-4 text-pickle-700" />
                {teacherSchool.name}
              </div>
              {teacherSchool.city ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1">
                  <Building2 className="h-4 w-4 text-pickle-700" />
                  {teacherSchool.city}
                  {teacherSchool.stateProvince ? `, ${teacherSchool.stateProvince}` : ""}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/teacher/classes/new"
            className="inline-flex items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Create classroom
          </Link>

          <Link
            href="/leaderboards"
            className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-pickle-50"
          >
            Open leaderboards
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="text-sm font-medium text-muted">Classes</div>
          <div className="mt-2 text-3xl font-semibold text-ink">{classrooms.length}</div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="text-sm font-medium text-muted">Students</div>
          <div className="mt-2 text-3xl font-semibold text-ink">{studentIds.length}</div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="text-sm font-medium text-muted">Published assignments</div>
          <div className="mt-2 text-3xl font-semibold text-ink">{publishedAssignments}</div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="text-sm font-medium text-muted">Puzzle completions</div>
          <div className="mt-2 text-3xl font-semibold text-ink">{completedRows.length}</div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-ink">Your classrooms</h2>
              <p className="mt-1 text-sm text-muted">
                Enter each classroom to assign puzzles, check results, and drill into student data.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
              <Sparkles className="h-4 w-4" />
              Teacher control center
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {classrooms.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-6 text-muted">
                No classrooms yet. Create your first class to get started.
              </div>
            ) : (
              classrooms.map((classroom) => {
                const classroomProgress = progressRows.filter(
                  (row) => row.classroomId === classroom.id
                );
                const classroomCompletions = classroomProgress.filter(
                  (row) => row.isCompleted
                ).length;

                return (
                  <Link
                    key={classroom.id}
                    href={`/dashboard/teacher/classes/${classroom.id}`}
                    className="rounded-2xl border border-line p-5 transition hover:border-pickle-300 hover:bg-pickle-50/40"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-ink">{classroom.name}</div>
                        <div className="mt-1 text-sm text-muted">
                          Join code: <span className="font-semibold text-ink">{classroom.joinCode}</span>
                        </div>
                        <div className="mt-1 text-sm text-muted">
                          {classroom.gradeLabel || "No grade"} • {classroom.subjectLabel || "No subject"}
                        </div>
                      </div>

                      <div className="text-right text-sm text-muted">
                        <div>{classroom.memberships.length} students</div>
                        <div>{classroom.assignments.length} assignments</div>
                        <div>{classroomCompletions} completions</div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-ink">Top students</h2>
              <div className="inline-flex items-center gap-2 rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
                <Trophy className="h-4 w-4" />
                By total points
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {topStudents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line p-6 text-muted">
                  Student rankings will appear here as soon as puzzle data comes in.
                </div>
              ) : (
                topStudents.map((student, index) => (
                  <Link
                    key={student.studentId}
                    href={`/dashboard/teacher/students/${student.studentId}`}
                    className="rounded-2xl border border-line p-4 transition hover:border-pickle-300 hover:bg-pickle-50/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm text-muted">#{index + 1}</div>
                        <div className="font-semibold text-ink">{student.studentName}</div>
                        <div className="mt-1 text-sm text-muted">
                          {student.completedCount} completions • {student.totalAttempts} attempts
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-semibold text-ink">
                          {formatNumber(student.totalPoints)}
                        </div>
                        <div className="text-xs text-muted">
                          Best time {formatTime(student.bestTimeMs)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-ink">Recent activity</h2>
              <div className="inline-flex items-center gap-2 rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
                <Timer className="h-4 w-4" />
                Latest puzzle work
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {recentActivity.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line p-6 text-muted">
                  No recent student activity yet.
                </div>
              ) : (
                recentActivity.map((row) => (
                  <div key={row.id} className="rounded-2xl border border-line p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-ink">
                          {row.student.displayName || row.student.firstName}
                        </div>
                        <div className="mt-1 text-sm text-muted">
                          {row.puzzle.title} • {row.classroom?.name || "No classroom"}
                        </div>
                      </div>

                      <div className="text-right text-sm text-muted">
                        <div>{row.totalPointsEarned} points</div>
                        <div>{row.isCompleted ? "Completed" : `${row.completionPct}% complete`}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-line bg-canvas p-4">
                <div className="text-sm font-medium text-muted">Total tracked play time</div>
                <div className="mt-2 text-xl font-semibold text-ink">
                  {formatTime(totalPlayTimeMs)}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-canvas p-4">
                <div className="text-sm font-medium text-muted">Total points earned</div>
                <div className="mt-2 text-xl font-semibold text-ink">
                  {formatNumber(
                    progressRows.reduce((sum, row) => sum + row.totalPointsEarned, 0)
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-canvas p-4">
                <div className="text-sm font-medium text-muted">Next step</div>
                <div className="mt-2 text-sm font-semibold text-ink">
                  Leaderboards and student analytics
                </div>
                <div className="mt-2 text-xs text-muted">
                  Drill into individual students and compare classrooms.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-ink">Leaderboard direction</h2>
            <p className="mt-1 text-sm text-muted">
              The next layer will let you compare by class, school, province or state, country, and global rankings.
            </p>
          </div>

          <Link
            href="/leaderboards"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-pickle-50"
          >
            Explore leaderboards
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            "Top students in each class",
            "Top classrooms in each school",
            "Regional ranking by province or state",
            "Country-wide student competition",
            "Global puzzle and classroom standings"
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-line bg-canvas p-4 text-sm text-ink">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}