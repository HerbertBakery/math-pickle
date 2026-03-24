import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BookOpen, CalendarDays, ExternalLink, GraduationCap, Plus, Tag, Users } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function prettyStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function prettyType(type: string) {
  return type
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export default async function TeacherClassroomDetailPage({
  params
}: {
  params: { classroomId: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  const classroom = await prisma.classroom.findFirst({
    where: {
      id: params.classroomId,
      teacherId: session.user.id
    },
    include: {
      memberships: {
        include: {
          user: true
        },
        orderBy: {
          joinedAt: "desc"
        }
      },
      assignments: {
        include: {
          puzzle: true,
          puzzleVariant: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!classroom) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <Link href="/dashboard/teacher" className="text-sm font-medium text-pickle-800 hover:underline">
          ← Back to dashboard
        </Link>
      </div>

      <section className="rounded-[2rem] border border-line bg-white p-8 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
              Classroom
            </div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">{classroom.name}</h1>
            <p className="mt-3 text-muted">
              {classroom.gradeLabel || "No grade yet"} • {classroom.subjectLabel || "No subject yet"}
            </p>
          </div>

          <div className="rounded-2xl border border-pickle-200 bg-pickle-50 px-5 py-4 text-right">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-pickle-700">Join code</div>
            <div className="mt-2 text-2xl font-bold tracking-[0.18em] text-ink">{classroom.joinCode}</div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="text-sm font-medium text-muted">Students</div>
          <div className="mt-2 text-3xl font-semibold text-ink">{classroom.memberships.length}</div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="text-sm font-medium text-muted">Assignments</div>
          <div className="mt-2 text-3xl font-semibold text-ink">{classroom.assignments.length}</div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="text-sm font-medium text-muted">Status</div>
          <div className="mt-2 text-3xl font-semibold text-ink">Live</div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink">Students</h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
              <Users className="h-4 w-4" />
              {classroom.memberships.length} enrolled
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {classroom.memberships.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-6 text-muted">
                No students yet. Share the join code above so students can sign up and enter this classroom.
              </div>
            ) : (
              classroom.memberships.map((membership) => (
                <div key={membership.id} className="rounded-2xl border border-line p-4">
                  <div className="font-semibold text-ink">
                    {membership.user.displayName || membership.user.firstName}
                  </div>
                  <div className="mt-1 text-sm text-muted">{membership.user.email}</div>
                  <div className="mt-2 text-xs text-muted">Joined {formatDate(membership.joinedAt)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-ink">Assignments</h2>
              <p className="mt-1 text-sm text-muted">
                Assign exact official boards, maps, and modes to this class.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
                <BookOpen className="h-4 w-4" />
                {classroom.assignments.length} total
              </div>

              <Link
                href={`/dashboard/teacher/classes/${classroom.id}/assign`}
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
              >
                <Plus className="h-4 w-4" />
                Assign puzzle
              </Link>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {classroom.assignments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-6 text-muted">
                No assignments yet. Use the Assign puzzle button above to add one from your puzzle library.
              </div>
            ) : (
              classroom.assignments.map((assignment) => (
                <div key={assignment.id} className="rounded-2xl border border-line p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/puzzles/${assignment.puzzle.slug}`}
                        className="font-semibold text-ink hover:text-pickle-800 hover:underline"
                      >
                        {assignment.titleOverride || assignment.puzzle.title}
                      </Link>

                      <div className="mt-1 text-sm text-muted">
                        {assignment.puzzle.subject || "General mathematics"} •{" "}
                        {assignment.puzzle.gradeBand || "Mixed grades"}
                      </div>
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        assignment.status === "PUBLISHED"
                          ? "bg-pickle-50 text-pickle-800"
                          : assignment.status === "DRAFT"
                            ? "bg-amber-50 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {prettyStatus(assignment.status)}
                    </div>
                  </div>

                  {assignment.puzzleVariant ? (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                      <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                        <Tag className="h-3.5 w-3.5" />
                        {assignment.puzzleVariant.title}
                      </div>
                    </div>
                  ) : null}

                  {assignment.instructions ? (
                    <p className="mt-3 text-sm leading-6 text-muted">{assignment.instructions}</p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                    <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Created {formatDate(assignment.createdAt)}
                    </div>

                    <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {prettyType(assignment.puzzle.type)}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/play/${assignment.puzzle.slug}?classroomId=${assignment.classroomId}&assignmentId=${assignment.id}${assignment.puzzleVariant ? `&variant=${assignment.puzzleVariant.slug}` : ""}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-pickle-50"
                    >
                      Open puzzle
                      <ExternalLink className="h-4 w-4" />
                    </Link>
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