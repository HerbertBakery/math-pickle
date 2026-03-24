import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, ExternalLink, GraduationCap, Tag } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function prettyType(type: string) {
  return type
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "STUDENT") {
    redirect("/dashboard/teacher");
  }

  const memberships = await prisma.classroomMembership.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      classroom: {
        include: {
          assignments: {
            where: {
              status: "PUBLISHED"
            },
            include: {
              puzzle: true,
              puzzleVariant: true
            },
            orderBy: {
              createdAt: "desc"
            }
          }
        }
      }
    }
  });

  const totalAssignments = memberships.reduce(
    (sum, membership) => sum + membership.classroom.assignments.length,
    0
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
          Student dashboard
        </div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
          Welcome back{session.user.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="mt-3 text-muted">
          Open your assigned puzzles, work through classroom challenges, and build toward future progress and leaderboard features.
        </p>
      </div>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="text-sm font-medium text-muted">Joined classes</div>
          <div className="mt-2 text-3xl font-semibold text-ink">{memberships.length}</div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="text-sm font-medium text-muted">Published assignments</div>
          <div className="mt-2 text-3xl font-semibold text-ink">{totalAssignments}</div>
        </div>
      </section>

      <section className="mt-10 space-y-6">
        {memberships.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-line bg-white p-6 text-muted shadow-soft">
            You have not joined a classroom yet.
          </div>
        ) : (
          memberships.map((membership) => (
            <div
              key={membership.id}
              className="rounded-[2rem] border border-line bg-white p-6 shadow-soft"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-ink">{membership.classroom.name}</h2>
                  <p className="mt-2 text-sm text-muted">
                    {membership.classroom.gradeLabel || "No grade"} •{" "}
                    {membership.classroom.subjectLabel || "No subject"}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
                  <BookOpen className="h-4 w-4" />
                  {membership.classroom.assignments.length} published
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {membership.classroom.assignments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line p-5 text-muted">
                    No published assignments in this class yet.
                  </div>
                ) : (
                  membership.classroom.assignments.map((assignment) => (
                    <div key={assignment.id} className="rounded-2xl border border-line p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/puzzles/${assignment.puzzle.slug}`}
                            className="text-lg font-semibold text-ink hover:text-pickle-800 hover:underline"
                          >
                            {assignment.titleOverride || assignment.puzzle.title}
                          </Link>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
                            <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                              <GraduationCap className="h-3.5 w-3.5" />
                              {assignment.puzzle.gradeBand || "Mixed grades"}
                            </div>

                            <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                              {prettyType(assignment.puzzle.type)}
                            </div>

                            {assignment.puzzle.subject ? (
                              <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                                {assignment.puzzle.subject}
                              </div>
                            ) : null}

                            {assignment.puzzleVariant ? (
                              <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                                <Tag className="h-3.5 w-3.5" />
                                {assignment.puzzleVariant.title}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <Link
                          href={`/play/${assignment.puzzle.slug}?classroomId=${membership.classroom.id}&assignmentId=${assignment.id}${assignment.puzzleVariant ? `&variant=${assignment.puzzleVariant.slug}` : ""}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                        >
                          Open
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>

                      {assignment.instructions ? (
                        <p className="mt-4 text-sm leading-6 text-muted">{assignment.instructions}</p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}