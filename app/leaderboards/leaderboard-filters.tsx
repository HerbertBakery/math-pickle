"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type VariantOption = {
  slug: string;
  title: string;
};

type PuzzleOption = {
  slug: string;
  title: string;
  variants: VariantOption[];
};

export function LeaderboardFilters({
  puzzles,
  selectedPuzzleSlug,
  selectedVariantSlug,
  selectedScope,
  selectedType
}: {
  puzzles: PuzzleOption[];
  selectedPuzzleSlug: string;
  selectedVariantSlug: string;
  selectedScope: string;
  selectedType: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPuzzle =
    puzzles.find((puzzle) => puzzle.slug === selectedPuzzleSlug) ?? puzzles[0] ?? null;

  const variants = selectedPuzzle?.variants ?? [];

  const selectedVariant =
    variants.find((variant) => variant.slug === selectedVariantSlug) ?? variants[0] ?? null;

  const currentParams = useMemo(
    () => new URLSearchParams(searchParams?.toString() || ""),
    [searchParams]
  );

  function pushParams(next: Record<string, string>) {
    const params = new URLSearchParams(currentParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      params.set(key, value);
    });

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-line bg-white p-6 shadow-soft">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label htmlFor="leaderboard-puzzle" className="mb-2 block text-sm font-semibold text-ink">
            Puzzle
          </label>
          <select
            id="leaderboard-puzzle"
            value={selectedPuzzle?.slug || ""}
            onChange={(event) => {
              const nextPuzzle = puzzles.find((puzzle) => puzzle.slug === event.target.value);
              const nextVariant = nextPuzzle?.variants[0]?.slug || "";
              pushParams({
                puzzle: event.target.value,
                variant: nextVariant
              });
            }}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-pickle-400"
          >
            {puzzles.map((puzzle) => (
              <option key={puzzle.slug} value={puzzle.slug}>
                {puzzle.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="leaderboard-variant" className="mb-2 block text-sm font-semibold text-ink">
            Mode / board
          </label>
          <select
            id="leaderboard-variant"
            value={selectedVariant?.slug || ""}
            onChange={(event) => {
              pushParams({
                variant: event.target.value
              });
            }}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-pickle-400"
          >
            {variants.map((variant) => (
              <option key={variant.slug} value={variant.slug}>
                {variant.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="leaderboard-scope" className="mb-2 block text-sm font-semibold text-ink">
            Scope
          </label>
          <select
            id="leaderboard-scope"
            value={selectedScope}
            onChange={(event) => {
              pushParams({
                scope: event.target.value
              });
            }}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-pickle-400"
          >
            <option value="global">Global</option>
            <option value="country">Country</option>
            <option value="state">State / Province</option>
            <option value="school">School</option>
            <option value="classroom">Classroom</option>
          </select>
        </div>

        <div>
          <label htmlFor="leaderboard-type" className="mb-2 block text-sm font-semibold text-ink">
            Ranking type
          </label>
          <select
            id="leaderboard-type"
            value={selectedType}
            onChange={(event) => {
              pushParams({
                type: event.target.value
              });
            }}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-pickle-400"
          >
            <option value="individual">Individual</option>
            <option value="classroom">Classroom</option>
          </select>
        </div>
      </div>
    </section>
  );
}