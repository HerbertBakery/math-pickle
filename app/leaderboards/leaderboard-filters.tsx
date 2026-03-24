"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type LeaderboardFiltersProps = {
  puzzleOptions: Array<{ slug: string; title: string }>;
  variantOptions: Array<{ slug: string; title: string }>;
  selectedPuzzle: string;
  selectedVariant: string;
  selectedScope: string;
  selectedType: string;
};

export function LeaderboardFilters({
  puzzleOptions,
  variantOptions,
  selectedPuzzle,
  selectedVariant,
  selectedScope,
  selectedType
}: LeaderboardFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParams(next: {
    puzzle?: string;
    variant?: string;
    scope?: string;
    type?: string;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.puzzle !== undefined) {
      if (next.puzzle) params.set("puzzle", next.puzzle);
      else params.delete("puzzle");
    }

    if (next.variant !== undefined) {
      if (next.variant) params.set("variant", next.variant);
      else params.delete("variant");
    }

    if (next.scope !== undefined) {
      if (next.scope) params.set("scope", next.scope);
      else params.delete("scope");
    }

    if (next.type !== undefined) {
      if (next.type) params.set("type", next.type);
      else params.delete("type");
    }

    const query = params.toString();
    const href = (query ? `${pathname}?${query}` : pathname) as Route;

    router.push(href);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Puzzle
        </label>
        <select
          value={selectedPuzzle}
          onChange={(e) =>
            updateParams({
              puzzle: e.target.value,
              variant: ""
            })
          }
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-pickle-400"
        >
          {puzzleOptions.map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.title}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Board / mode / variant
        </label>
        <select
          value={selectedVariant}
          onChange={(e) =>
            updateParams({
              variant: e.target.value
            })
          }
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-pickle-400"
        >
          {variantOptions.length === 0 ? (
            <option value="">No variants available</option>
          ) : (
            variantOptions.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.title}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Scope
        </label>
        <select
          value={selectedScope}
          onChange={(e) =>
            updateParams({
              scope: e.target.value
            })
          }
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-pickle-400"
        >
          <option value="global">Global</option>
          <option value="country">Country</option>
          <option value="state">State / Province</option>
          <option value="school">School</option>
          <option value="classroom">Classroom</option>
        </select>
      </div>

      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Ranking type
        </label>
        <select
          value={selectedType}
          onChange={(e) =>
            updateParams({
              type: e.target.value
            })
          }
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-pickle-400"
        >
          <option value="individual">Individual</option>
          <option value="classroom">Classroom</option>
        </select>
      </div>
    </div>
  );
}