import Link from "next/link";
import { BookOpen, Clock3, GraduationCap, Sparkles, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";

function prettyType(type: string) {
  return type
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function PuzzleLibraryPage() {
  const puzzles = await prisma.puzzle.findMany({
    orderBy: [
      { featured: "desc" },
      { title: "asc" }
    ]
  });

  const featured = puzzles.filter((puzzle) => puzzle.featured);
  const others = puzzles.filter((puzzle) => !puzzle.featured);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <section className="rounded-[2rem] border border-line bg-gradient-to-b from-pickle-50 to-white p-8 shadow-soft">
        <div className="inline-flex items-center rounded-full border border-pickle-200 bg-white px-4 py-2 text-sm font-semibold text-pickle-800">
          Puzzle library
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Explore the MathPickle puzzle collection
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          Browse classroom-ready puzzles, games, and interactives by grade band, subject, and type. This library is built to grow from a few strong standalones into a full ecosystem of 100 activities.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <div className="text-sm font-medium text-muted">Total puzzles</div>
            <div className="mt-2 text-3xl font-semibold text-ink">{puzzles.length}</div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <div className="text-sm font-medium text-muted">Featured</div>
            <div className="mt-2 text-3xl font-semibold text-ink">{featured.length}</div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <div className="text-sm font-medium text-muted">Interactive or game</div>
            <div className="mt-2 text-3xl font-semibold text-ink">
              {
                puzzles.filter(
                  (puzzle) => puzzle.type === "INTERACTIVE" || puzzle.type === "GAME"
                ).length
              }
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <div className="text-sm font-medium text-muted">Built for classrooms</div>
            <div className="mt-2 text-3xl font-semibold text-ink">Yes</div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-pickle-700" />
          <h2 className="text-2xl font-semibold text-ink">Featured puzzles</h2>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-line bg-white p-6 text-muted shadow-soft">
            No featured puzzles yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((puzzle) => (
              <Link
                key={puzzle.id}
                href={`/puzzles/${puzzle.slug}`}
                className="rounded-[2rem] border border-line bg-white p-6 shadow-soft transition hover:border-pickle-300 hover:bg-pickle-50/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xl font-semibold text-ink">{puzzle.title}</div>
                  <div className="rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
                    Featured
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted">{puzzle.summary}</p>

                <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
                  <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {prettyType(puzzle.type)}
                  </div>

                  {puzzle.gradeBand ? (
                    <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {puzzle.gradeBand}
                    </div>
                  ) : null}

                  {puzzle.subject ? (
                    <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                      <Tag className="h-3.5 w-3.5" />
                      {puzzle.subject}
                    </div>
                  ) : null}

                  {puzzle.estimatedMins ? (
                    <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {puzzle.estimatedMins} min
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 text-sm font-semibold text-pickle-800">
                  Open puzzle →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-ink">All puzzles</h2>
          <p className="mt-2 text-sm text-muted">
            This section will eventually support filters for grade, subject, puzzle type, and featured collections.
          </p>
        </div>

        {others.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-line bg-white p-6 text-muted shadow-soft">
            No additional puzzles yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {others.map((puzzle) => (
              <Link
                key={puzzle.id}
                href={`/puzzles/${puzzle.slug}`}
                className="rounded-[2rem] border border-line bg-white p-6 shadow-soft transition hover:border-pickle-300 hover:bg-pickle-50/30"
              >
                <div className="text-xl font-semibold text-ink">{puzzle.title}</div>
                <p className="mt-3 text-sm leading-6 text-muted">{puzzle.summary}</p>

                <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
                  <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {prettyType(puzzle.type)}
                  </div>

                  {puzzle.gradeBand ? (
                    <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {puzzle.gradeBand}
                    </div>
                  ) : null}

                  {puzzle.subject ? (
                    <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                      <Tag className="h-3.5 w-3.5" />
                      {puzzle.subject}
                    </div>
                  ) : null}

                  {puzzle.estimatedMins ? (
                    <div className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {puzzle.estimatedMins} min
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 text-sm font-semibold text-pickle-800">
                  Open puzzle →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}