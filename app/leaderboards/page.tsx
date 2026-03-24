import Link from "next/link";
import { Building2, Globe2, School, Trophy, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LeaderboardFilters } from "./leaderboard-filters";

function formatTime(ms: number | null | undefined) {
  if (!ms || ms <= 0) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

function getScopeLabel(scope: string) {
  switch (scope) {
    case "classroom":
      return "Classroom";
    case "school":
      return "School";
    case "state":
      return "State / Province";
    case "country":
      return "Country";
    default:
      return "Global";
  }
}

function getDirectionLabel(direction: string) {
  return direction === "LOWER_BETTER" ? "Lower is better" : "Higher is better";
}

function getMetricType(configJson: unknown) {
  if (
    configJson &&
    typeof configJson === "object" &&
    "metricType" in configJson &&
    (configJson as { metricType?: unknown }).metricType === "time"
  ) {
    return "time";
  }

  return "score";
}

export default async function LeaderboardsPage({
  searchParams
}: {
  searchParams?: {
    puzzle?: string;
    variant?: string;
    scope?: string;
    type?: string;
  };
}) {
  const selectedPuzzleSlug = searchParams?.puzzle?.trim() || "";
  const selectedVariantSlug = searchParams?.variant?.trim() || "";
  const selectedScope = searchParams?.scope?.trim() || "global";
  const selectedType = searchParams?.type?.trim() || "individual";

  const puzzles = await prisma.puzzle.findMany({
    include: {
      variants: {
        where: {
          leaderboardEnabled: true,
          isOfficial: true
        },
        orderBy: {
          title: "asc"
        }
      }
    },
    orderBy: {
      title: "asc"
    }
  });

  const selectedPuzzle =
    puzzles.find((puzzle) => puzzle.slug === selectedPuzzleSlug) ?? puzzles[0] ?? null;

  const variantsForSelectedPuzzle = selectedPuzzle?.variants ?? [];

  const selectedVariant =
    variantsForSelectedPuzzle.find((variant) => variant.slug === selectedVariantSlug) ??
    variantsForSelectedPuzzle[0] ??
    null;

  const metricType = selectedVariant ? getMetricType(selectedVariant.configJson) : "score";
  const lowerBetter = selectedVariant?.scoreDirection === "LOWER_BETTER";

  const individualRows =
    selectedType === "individual" && selectedPuzzle && selectedVariant
      ? await prisma.puzzleLeaderboardEntry.findMany({
          where: {
            puzzleId: selectedPuzzle.id,
            puzzleVariantId: selectedVariant.id,
            ...(selectedScope === "classroom" ? { classroomId: { not: null } } : {}),
            ...(selectedScope === "school" ? { schoolId: { not: null } } : {}),
            ...(selectedScope === "country" ? { countryCode: { not: null } } : {}),
            ...(selectedScope === "state" ? { stateProvince: { not: null } } : {})
          },
          include: {
            user: true,
            puzzle: true,
            puzzleVariant: true,
            classroom: true,
            school: true
          },
          orderBy:
            metricType === "time"
              ? [{ timeMs: "asc" }, { attempts: "asc" }]
              : lowerBetter
                ? [{ score: "asc" }, { timeMs: "asc" }]
                : [{ score: "desc" }, { timeMs: "asc" }],
          take: 50
        })
      : [];

  const classroomRows =
    selectedType === "classroom" && selectedPuzzle && selectedVariant
      ? await prisma.classroom.findMany({
          where:
            selectedScope === "school"
              ? { schoolId: { not: null } }
              : selectedScope === "country"
                ? { countryCode: { not: null } }
                : selectedScope === "state"
                  ? { stateProvince: { not: null } }
                  : undefined,
          include: {
            school: true,
            memberships: true,
            progress: {
              where: {
                puzzleId: selectedPuzzle.id,
                puzzleVariantId: selectedVariant.id
              }
            }
          }
        })
      : [];

  const rankedClassrooms = classroomRows
    .map((classroom) => {
      const primaryTotal =
        metricType === "time"
          ? classroom.progress.reduce((sum, row) => sum + (row.bestTimeMs ?? 0), 0)
          : classroom.progress.reduce((sum, row) => sum + (row.bestScore ?? 0), 0);

      return {
        id: classroom.id,
        name: classroom.name,
        schoolName: classroom.school?.name || "No school",
        countryCode: classroom.countryCode || "—",
        stateProvince: classroom.stateProvince || "—",
        studentCount: classroom.memberships.length,
        primaryTotal,
        totalCompleted: classroom.progress.filter((row) => row.isCompleted).length,
        totalAttempts: classroom.progress.reduce((sum, row) => sum + row.attempts, 0)
      };
    })
    .sort((a, b) => {
      if (lowerBetter) {
        if (a.primaryTotal !== b.primaryTotal) return a.primaryTotal - b.primaryTotal;
      } else {
        if (b.primaryTotal !== a.primaryTotal) return b.primaryTotal - a.primaryTotal;
      }

      if (b.totalCompleted !== a.totalCompleted) return b.totalCompleted - a.totalCompleted;
      return a.totalAttempts - b.totalAttempts;
    })
    .slice(0, 50);

  const puzzleOptions = puzzles.map((puzzle) => ({
    slug: puzzle.slug,
    title: puzzle.title,
    variants: puzzle.variants.map((variant) => ({
      slug: variant.slug,
      title: variant.title
    }))
  }));

  const variantOptions =
    selectedPuzzle?.variants.map((variant) => ({
      slug: variant.slug,
      title: variant.title
    })) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <section className="rounded-[2rem] border border-line bg-gradient-to-b from-pickle-50 to-white p-8 shadow-soft">
        <div className="inline-flex items-center rounded-full border border-pickle-200 bg-white px-4 py-2 text-sm font-semibold text-pickle-800">
          Leaderboards
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Puzzle leaderboards by mode, board, scope, and ranking type
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          Pick a puzzle, choose the exact board or mode, then view rankings by individual or
          classroom across classroom, school, state or province, country, or global results.
        </p>

        <LeaderboardFilters
          puzzleOptions={puzzleOptions}
          variantOptions={variantOptions}
          selectedPuzzle={selectedPuzzle?.slug || ""}
          selectedVariant={selectedVariant?.slug || ""}
          selectedScope={selectedScope}
          selectedType={selectedType}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <div className="text-sm font-medium text-muted">Puzzle</div>
            <div className="mt-2 text-xl font-semibold text-ink">
              {selectedPuzzle?.title || "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <div className="text-sm font-medium text-muted">Mode / board</div>
            <div className="mt-2 text-xl font-semibold text-ink">
              {selectedVariant?.title || "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <div className="text-sm font-medium text-muted">Scope</div>
            <div className="mt-2 text-xl font-semibold text-ink">
              {getScopeLabel(selectedScope)}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <div className="text-sm font-medium text-muted">Scoring rule</div>
            <div className="mt-2 text-xl font-semibold text-ink">
              {selectedVariant ? getDirectionLabel(selectedVariant.scoreDirection) : "—"}
            </div>
          </div>
        </div>
      </section>

      {selectedType === "individual" ? (
        <section className="mt-10 rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-ink">Top individuals</h2>
              <p className="mt-1 text-sm text-muted">
                Ranked for the selected puzzle mode or board.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
              <Trophy className="h-4 w-4" />
              Individual
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-line">
            <div className="grid grid-cols-[56px_1.3fr_1.2fr_140px_110px] gap-3 border-b border-line bg-canvas px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              <div>#</div>
              <div>Student</div>
              <div>Mode / board</div>
              <div>{selectedVariant?.primaryMetricLabel || "Metric"}</div>
              <div>Time</div>
            </div>

            {individualRows.length === 0 ? (
              <div className="p-6 text-sm text-muted">
                No leaderboard data yet for this selection.
              </div>
            ) : (
              individualRows.map((row, index) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[56px_1.3fr_1.2fr_140px_110px] gap-3 border-b border-line px-4 py-4 text-sm last:border-b-0"
                >
                  <div className="font-semibold text-ink">{index + 1}</div>

                  <div>
                    <div className="font-semibold text-ink">
                      {row.user.displayName || row.user.firstName}
                    </div>
                    <div className="mt-1 text-xs text-muted">
                      {selectedScope === "classroom"
                        ? row.classroom?.name || "No classroom"
                        : selectedScope === "school"
                          ? row.school?.name || "No school"
                          : selectedScope === "state"
                            ? row.stateProvince || "—"
                            : selectedScope === "country"
                              ? row.countryCode || "—"
                              : row.school?.name || row.countryCode || "—"}
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-ink">
                      {row.puzzleVariant?.title || row.puzzle.title}
                    </div>
                    <div className="mt-1 text-xs text-muted">{row.puzzle.title}</div>
                  </div>

                  <div className="font-semibold text-ink">
                    {metricType === "time" ? formatTime(row.timeMs) : row.score}
                  </div>

                  <div className="text-muted">{formatTime(row.timeMs)}</div>
                </div>
              ))
            )}
          </div>
        </section>
      ) : (
        <section className="mt-10 rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-ink">Top classrooms</h2>
              <p className="mt-1 text-sm text-muted">
                Ranked for the selected puzzle mode or board.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-pickle-50 px-3 py-1 text-xs font-semibold text-pickle-800">
              <Users className="h-4 w-4" />
              Classroom
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-line">
            <div className="grid grid-cols-[56px_1.4fr_110px_140px_120px] gap-3 border-b border-line bg-canvas px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              <div>#</div>
              <div>Classroom</div>
              <div>Students</div>
              <div>{selectedVariant?.primaryMetricLabel || "Metric"}</div>
              <div>Completed</div>
            </div>

            {rankedClassrooms.length === 0 ? (
              <div className="p-6 text-sm text-muted">
                No classroom leaderboard data yet for this selection.
              </div>
            ) : (
              rankedClassrooms.map((row, index) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[56px_1.4fr_110px_140px_120px] gap-3 border-b border-line px-4 py-4 text-sm last:border-b-0"
                >
                  <div className="font-semibold text-ink">{index + 1}</div>

                  <div>
                    <div className="font-semibold text-ink">{row.name}</div>
                    <div className="mt-1 text-xs text-muted">
                      {row.schoolName} • {row.stateProvince} • {row.countryCode}
                    </div>
                  </div>

                  <div className="text-ink">{row.studentCount}</div>
                  <div className="font-semibold text-ink">
                    {metricType === "time" ? formatTime(row.primaryTotal) : row.primaryTotal}
                  </div>
                  <div className="text-ink">{row.totalCompleted}</div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      <section className="mt-10 grid gap-8 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <School className="h-5 w-5 text-pickle-700" />
            <h2 className="text-xl font-semibold text-ink">School competition</h2>
          </div>
          <p className="text-sm leading-7 text-muted">
            Every official board and mode can become its own fair competition lane.
          </p>
        </div>

        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-pickle-700" />
            <h2 className="text-xl font-semibold text-ink">Regional ranking</h2>
          </div>
          <p className="text-sm leading-7 text-muted">
            State and province views become more meaningful as more schools join the same official
            puzzle variants.
          </p>
        </div>

        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-pickle-700" />
            <h2 className="text-xl font-semibold text-ink">Global standings</h2>
          </div>
          <p className="text-sm leading-7 text-muted">
            Global rankings should compare only standardized official boards and modes, not
            classroom-only custom versions.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-line bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-ink">Where this goes next</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            "Teacher-only class leaderboard filters",
            "Student drill-down analytics cards",
            "Variant-aware assignment creation",
            "Live ranking refresh from saved puzzle results",
            "A full 100-puzzle competitive ecosystem"
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-line bg-canvas p-4 text-sm text-ink"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href="/puzzles"
            className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-pickle-50"
          >
            Explore puzzle library
          </Link>
        </div>
      </section>
    </main>
  );
}