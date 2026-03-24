import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock3, GraduationCap, Shapes, Sparkles, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getPuzzleDelivery } from "@/lib/puzzle-registry";

function prettyType(type: string) {
  return type
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function PuzzleDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const puzzle = await prisma.puzzle.findUnique({
    where: {
      slug: params.slug
    }
  });

  if (!puzzle) {
    notFound();
  }

  const delivery = getPuzzleDelivery(puzzle.slug);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <Link href="/" className="text-sm font-medium text-pickle-800 hover:underline">
          ← Back to home
        </Link>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
        <div className="border-b border-line bg-gradient-to-b from-pickle-50 to-white px-8 py-10">
          <div className="inline-flex items-center rounded-full border border-pickle-200 bg-white px-4 py-2 text-sm font-medium text-pickle-800 shadow-soft">
            Puzzle library
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            {puzzle.title}
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
            {puzzle.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink">
              <Shapes className="h-4 w-4 text-pickle-700" />
              {prettyType(puzzle.type)}
            </div>

            {puzzle.gradeBand ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink">
                <GraduationCap className="h-4 w-4 text-pickle-700" />
                Grade band: {puzzle.gradeBand}
              </div>
            ) : null}

            {puzzle.subject ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink">
                <Tag className="h-4 w-4 text-pickle-700" />
                {puzzle.subject}
              </div>
            ) : null}

            {puzzle.estimatedMins ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink">
                <Clock3 className="h-4 w-4 text-pickle-700" />
                About {puzzle.estimatedMins} min
              </div>
            ) : null}

            {puzzle.featured ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-pickle-200 bg-pickle-50 px-4 py-2 text-sm font-semibold text-pickle-800">
                <Sparkles className="h-4 w-4" />
                Featured
              </div>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {delivery ? (
              <Link
                href={`/play/${puzzle.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Open puzzle
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                This puzzle exists in the library, but no launch source has been connected yet.
              </div>
            )}

            <Link
              href="/teacher-signup"
              className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-pickle-50"
            >
              Create teacher account
            </Link>
          </div>
        </div>

        <div className="grid gap-6 px-8 py-8 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-[1.5rem] border border-line bg-canvas p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
              What this page becomes
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-ink">The future home for each puzzle</h2>
            <p className="mt-4 leading-7 text-muted">
              This page is designed to become the central landing page for every MathPickle task. From here,
              students can launch the puzzle, teachers can assign it, and the platform can later show progress,
              leaderboard performance, and classroom activity.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-line bg-canvas p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-700">
              Coming next
            </div>
            <div className="mt-4 grid gap-3">
              {[
                "Teacher assignment controls for classroom use",
                "Student progress and completion tracking",
                "Puzzle-specific leaderboards",
                "School, country, and global rankings",
                "Consistent launch behavior for all standalone puzzles"
              ].map((item) => (
                <div key={item} className="rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}