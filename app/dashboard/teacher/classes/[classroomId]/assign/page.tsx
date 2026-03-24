import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { createAssignmentAction } from "@/app/actions/assignment";
import { prisma } from "@/lib/prisma";

function scoreDirectionLabel(direction: string) {
  return direction === "LOWER_BETTER" ? "Lower is better" : "Higher is better";
}

export default async function AssignPuzzlePage({
  params,
  searchParams
}: {
  params: { classroomId: string };
  searchParams?: { error?: string };
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
    }
  });

  if (!classroom) {
    notFound();
  }

  const puzzles = await prisma.puzzle.findMany({
    include: {
      variants: {
        where: {
          leaderboardEnabled: true,
          isOfficial: true
        },
        orderBy: [
          { title: "asc" }
        ]
      }
    },
    orderBy: [
      { featured: "desc" },
      { title: "asc" }
    ]
  });

  const totalVariants = puzzles.reduce((sum, puzzle) => sum + puzzle.variants.length, 0);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <Link
          href={`/dashboard/teacher/classes/${classroom.id}`}
          className="text-sm font-medium text-pickle-800 hover:underline"
        >
          ← Back to classroom
        </Link>
      </div>

      <section className="rounded-[2rem] border border-line bg-white p-8 shadow-soft">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
          Assign puzzle
        </div>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Add an activity to {classroom.name}
        </h1>

        <p className="mt-3 text-muted">
          Choose the exact official puzzle variant, board, mode, or map you want this class to play.
          This is what students will launch, and it is the version that will feed leaderboard and
          analytics data.
        </p>

        {searchParams?.error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {searchParams.error}
          </div>
        ) : null}

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-line bg-canvas p-5">
            <div className="text-sm font-medium text-muted">Puzzle families</div>
            <div className="mt-2 text-3xl font-semibold text-ink">{puzzles.length}</div>
          </div>

          <div className="rounded-2xl border border-line bg-canvas p-5">
            <div className="text-sm font-medium text-muted">Official variants</div>
            <div className="mt-2 text-3xl font-semibold text-ink">{totalVariants}</div>
          </div>

          <div className="rounded-2xl border border-line bg-canvas p-5">
            <div className="text-sm font-medium text-muted">Leaderboard ready</div>
            <div className="mt-2 text-3xl font-semibold text-ink">Yes</div>
          </div>
        </div>

        <form action={createAssignmentAction} className="mt-8 grid gap-6">
          <input type="hidden" name="classroomId" value={classroom.id} />

          <div>
            <label htmlFor="puzzleVariantId" className="mb-2 block text-sm font-medium text-ink">
              Puzzle board / mode / variant
            </label>

            <select
              id="puzzleVariantId"
              name="puzzleVariantId"
              required
              defaultValue=""
              className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none transition focus:border-pickle-400"
            >
              <option value="" disabled>
                Select an official variant
              </option>

              {puzzles.map((puzzle) => (
                <optgroup key={puzzle.id} label={puzzle.title}>
                  {puzzle.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title}
                      {variant.primaryMetricLabel ? ` · ${variant.primaryMetricLabel}` : ""}
                      {variant.scoreDirection ? ` · ${scoreDirectionLabel(variant.scoreDirection)}` : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <p className="mt-2 text-sm text-muted">
              Teachers assign the exact version students will play. This keeps class results, analytics,
              and leaderboards aligned to the same board or mode.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-canvas p-5">
            <div className="text-sm font-semibold text-ink">Official variants available</div>

            <div className="mt-4 grid gap-4">
              {puzzles.map((puzzle) => (
                <div key={puzzle.id} className="rounded-2xl border border-line bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-ink">{puzzle.title}</div>
                      <div className="mt-1 text-sm text-muted">
                        {puzzle.gradeBand || "Mixed grades"}
                        {puzzle.subject ? ` • ${puzzle.subject}` : ""}
                      </div>
                    </div>

                    <div className="rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
                      {puzzle.variants.length} official variant{puzzle.variants.length === 1 ? "" : "s"}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2">
                    {puzzle.variants.length === 0 ? (
                      <div className="text-sm text-muted">No official variants yet.</div>
                    ) : (
                      puzzle.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="rounded-xl border border-line bg-canvas px-4 py-3"
                        >
                          <div className="font-medium text-ink">{variant.title}</div>
                          <div className="mt-1 text-xs text-muted">
                            Metric: {variant.primaryMetricLabel || "Score"} •{" "}
                            {scoreDirectionLabel(variant.scoreDirection)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="titleOverride" className="mb-2 block text-sm font-medium text-ink">
              Assignment title override
            </label>
            <input
              id="titleOverride"
              name="titleOverride"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
              placeholder="Optional custom title for this class"
            />
          </div>

          <div>
            <label htmlFor="instructions" className="mb-2 block text-sm font-medium text-ink">
              Instructions
            </label>
            <textarea
              id="instructions"
              name="instructions"
              rows={5}
              className="w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-pickle-400"
              placeholder="Optional instructions for students"
            />
          </div>

          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-medium text-ink">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue="DRAFT"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none transition focus:border-pickle-400"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Save assignment
            </button>

            <Link
              href={`/dashboard/teacher/classes/${classroom.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-pickle-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}