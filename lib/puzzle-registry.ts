export type PuzzleScoreDirection = "HIGHER_BETTER" | "LOWER_BETTER";

export type PuzzleVariantConfig = {
  slug: string;
  title: string;
  description?: string;
  isOfficial: boolean;
  leaderboardEnabled: boolean;
  scoreDirection: PuzzleScoreDirection;
  primaryMetricLabel: string;
  secondaryMetricLabel?: string;
  config?: Record<string, unknown>;
};

export type PuzzleDeliveryConfig = {
  mode: "standalone";
  publicPath: string;
  variants: PuzzleVariantConfig[];
};

export const standalonePuzzleRegistry: Record<string, PuzzleDeliveryConfig> = {
  "lazy-architect": {
    mode: "standalone",
    publicPath: "/standalone-puzzles/lazy-architect/index.html",
    variants: [
      {
        slug: "sequential-default",
        title: "Sequential Explorer",
        description: "Default sequential Lazy Architect play.",
        isOfficial: true,
        leaderboardEnabled: true,
        scoreDirection: "LOWER_BETTER",
        primaryMetricLabel: "Walls",
        secondaryMetricLabel: "Time",
        config: {
          mode: "sequential",
          boardFamily: "default"
        }
      },
      {
        slug: "classic-123456-16x18",
        title: "Classic 1,2,3,4,5,6 · 16x18",
        description: "Official classic Lazy Architect board on 16 by 18.",
        isOfficial: true,
        leaderboardEnabled: true,
        scoreDirection: "LOWER_BETTER",
        primaryMetricLabel: "Walls",
        secondaryMetricLabel: "Time",
        config: {
          mode: "classic",
          targets: [1, 2, 3, 4, 5, 6],
          rows: 16,
          cols: 18
        }
      },
      {
        slug: "energetic-123456-16x18",
        title: "Energetic 1,2,3,4,5,6 · 16x18",
        description: "Official energetic Lazy Architect board on 16 by 18.",
        isOfficial: true,
        leaderboardEnabled: true,
        scoreDirection: "HIGHER_BETTER",
        primaryMetricLabel: "Walls",
        secondaryMetricLabel: "Time",
        config: {
          mode: "energetic",
          targets: [1, 2, 3, 4, 5, 6],
          rows: 16,
          cols: 18
        }
      }
    ]
  },
  "animal-subtraction": {
    mode: "standalone",
    publicPath: "/standalone-puzzles/animal-subtraction/index.html",
    variants: [
      {
        slug: "default-board",
        title: "Default Board",
        description: "Official Animal Subtraction default board.",
        isOfficial: true,
        leaderboardEnabled: true,
        scoreDirection: "HIGHER_BETTER",
        primaryMetricLabel: "Score",
        secondaryMetricLabel: "Time",
        config: {
          boardFamily: "default"
        }
      }
    ]
  },
  "zebra-multiplication": {
    mode: "standalone",
    publicPath: "/standalone-puzzles/zebra-multiplication/index.html",
    variants: [
      {
        slug: "standard-board-1",
        title: "Standard Board 1",
        description: "Official Zebra Multiplication board 1.",
        isOfficial: true,
        leaderboardEnabled: true,
        scoreDirection: "HIGHER_BETTER",
        primaryMetricLabel: "Points",
        secondaryMetricLabel: "Time",
        config: {
          boardId: "board-1",
          mode: "standard"
        }
      },
      {
        slug: "standard-board-2",
        title: "Standard Board 2",
        description: "Official Zebra Multiplication board 2.",
        isOfficial: true,
        leaderboardEnabled: true,
        scoreDirection: "HIGHER_BETTER",
        primaryMetricLabel: "Points",
        secondaryMetricLabel: "Time",
        config: {
          boardId: "board-2",
          mode: "standard"
        }
      },
      {
        slug: "connect4-board-1",
        title: "Connect 4 Mode Board 1",
        description: "Official Connect 4 style Zebra Multiplication board.",
        isOfficial: true,
        leaderboardEnabled: true,
        scoreDirection: "HIGHER_BETTER",
        primaryMetricLabel: "Points",
        secondaryMetricLabel: "Time",
        config: {
          boardId: "board-1",
          mode: "connect4"
        }
      }
    ]
  }
};

export function getPuzzleDelivery(slug: string) {
  return standalonePuzzleRegistry[slug] ?? null;
}

export function getPuzzleVariantConfig(puzzleSlug: string, variantSlug: string) {
  const puzzle = standalonePuzzleRegistry[puzzleSlug];
  if (!puzzle) return null;
  return puzzle.variants.find((variant) => variant.slug === variantSlug) ?? null;
}

export function getDefaultPuzzleVariantConfig(puzzleSlug: string) {
  const puzzle = standalonePuzzleRegistry[puzzleSlug];
  if (!puzzle) return null;
  return puzzle.variants[0] ?? null;
}