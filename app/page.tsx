import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { ButtonLink } from "@/components/ui/button-link";
import { HomeHeroVideo } from "@/components/home-hero-video";

const highlights = [
  {
    title: "Classroom-ready puzzles",
    description:
      "High-quality tasks designed for real student thinking, discussion, and replay value.",
    icon: BookOpen
  },
  {
    title: "Teacher accounts",
    description:
      "Create classes, assign exact puzzle variants, and run challenge-based learning with structure.",
    icon: GraduationCap
  },
  {
    title: "Student access",
    description:
      "Students join quickly, open the right activity, and stay focused inside meaningful problem solving.",
    icon: Users
  },
  {
    title: "Live competition",
    description:
      "Use puzzle, board, class, school, and larger leaderboard views to build momentum.",
    icon: Trophy
  }
];

const platformCards = [
  {
    title: "Teacher dashboard",
    body: "Create classrooms, assign exact puzzle variants, and manage participation with clarity.",
    icon: GraduationCap
  },
  {
    title: "Student dashboard",
    body: "Launch assignments, track puzzle progress, and move through classroom challenge paths.",
    icon: LayoutDashboard
  },
  {
    title: "Puzzle library",
    body: "Browse interactives, games, and puzzle boards by grade, subject, and type of thinking.",
    icon: BookOpen
  },
  {
    title: "Leaderboards",
    body: "Compare results by board, puzzle, class, school, region, and beyond.",
    icon: Trophy
  }
];

const quickPoints = [
  ["Discover", "Browse puzzles, games, and challenge boards"],
  ["Assign", "Send exact variants into your classroom"],
  ["Compete", "Build momentum through real leaderboard play"]
];

const whyItWorks = [
  "Assign exact boards and puzzle variants",
  "Launch students into meaningful challenge fast",
  "Use classroom-ready games and interactives",
  "Track who played, solved, and scored",
  "Build momentum through leaderboards",
  "Bring puzzle culture into everyday teaching"
];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="border-b border-line bg-gradient-to-b from-pickle-50 to-white dark:from-[#101826] dark:to-[#0d1420]">
        <div className="mx-auto max-w-7xl px-6 py-3 lg:px-8">
          <Link
            href="/teacher-signup"
            className="group flex items-center justify-center gap-2 rounded-full border border-pickle-200 bg-white/80 px-4 py-2 text-sm font-semibold text-pickle-900 shadow-soft transition hover:border-pickle-400 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <Sparkles className="h-4 w-4" />
            Teachers are building classrooms now
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(111,189,71,0.08),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(243,201,107,0.10),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,140,110,0.10),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(70,110,170,0.12),transparent_22%)]" />

        <div className="mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-20">
          <div>
            <Link
              href="/teacher-signup"
              className="inline-flex items-center rounded-full border border-pickle-200 bg-white/90 px-4 py-2 text-sm font-semibold tracking-[-0.01em] text-pickle-700 shadow-soft transition hover:border-pickle-400 hover:bg-white dark:border-pickle-300/20 dark:bg-pickle-500/10 dark:text-pickle-200 dark:hover:border-pickle-300/40 dark:hover:bg-pickle-500/15"
            >
              Put your students in a pickle
            </Link>

            <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] text-ink sm:text-6xl lg:text-[4.75rem] dark:text-white">
              Puzzle-powered math
              <br />
              built for real classrooms
            </h1>

            <p className="mt-6 max-w-2xl text-[1.06rem] leading-8 text-muted sm:text-[1.12rem] dark:text-slate-300">
              MathPickle gives teachers a polished place to assign rich puzzles, launch classroom play,
              track progress, and build genuine excitement around mathematical thinking.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/teacher-signup">Create teacher account</ButtonLink>
              <ButtonLink href="/student-signup" variant="secondary">
                Join as a student
              </ButtonLink>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full px-1 text-sm font-semibold text-ink transition hover:text-pickle-700 dark:text-white/90 dark:hover:text-white"
              >
                Log in <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-11 grid gap-4 sm:grid-cols-3">
              {quickPoints.map(([title, subtitle]) => (
                <div
                  key={title}
                  className="rounded-[1.35rem] border border-line bg-white/80 p-4 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <div className="text-sm font-semibold tracking-[-0.01em] text-ink dark:text-white">
                    {title}
                  </div>
                  <div className="mt-1.5 text-sm leading-6 text-muted dark:text-slate-300">
                    {subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2.8rem] bg-pickle-100/80 blur-3xl dark:bg-pickle-500/10" />

            <div className="overflow-hidden rounded-[2.3rem] border border-line bg-[#0d1725] p-6 shadow-soft dark:border-white/10">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold tracking-[-0.01em] text-pickle-200">
                    Engaged Classroom
                  </div>
                  <div className="text-sm text-slate-300">
                    Real student energy. Real puzzle play.
                  </div>
                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/90">
                  Live feel
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.65rem] border border-white/10 bg-[#0a111b] shadow-soft">
                <HomeHeroVideo />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <LayoutDashboard className="h-4 w-4 text-pickle-200" />
                    Student flow
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Students join quickly, launch assignments, and stay inside the action.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Trophy className="h-4 w-4 text-pickle-200" />
                    Competition layer
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Puzzle variants, scoreboards, and classroom momentum are built into the experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item) => (
            <SectionCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="rounded-[2.2rem] border border-line bg-ink p-8 text-white shadow-soft dark:border-white/10 dark:bg-[#121826] lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-200">
                Built for real classroom use
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white md:text-[2.7rem]">
                More than a puzzle site
              </h2>

              <p className="mt-4 max-w-2xl text-[1rem] leading-8 text-white/80 dark:text-slate-300">
                Teachers can assign. Students can play. Classrooms can track progress.
                Great puzzles stay at the center, but the platform now gives them a stronger home.
              </p>

              <div className="mt-7 flex flex-wrap gap-4">
                <ButtonLink href="/teacher-signup">Start teaching with MathPickle</ButtonLink>
                <ButtonLink href="/student-signup" variant="secondary">
                  Join with class code
                </ButtonLink>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {platformCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5"
                  >
                    <Icon className="h-5 w-5 text-pickle-200" />
                    <div className="mt-3 text-base font-semibold tracking-[-0.01em] text-white">
                      {item.title}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-white/75 dark:text-slate-300">
                      {item.body}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-2 lg:px-8 lg:pb-24">
        <div className="grid gap-6 lg:grid-cols-[.92fr_1.08fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pickle-200">
              Why it works
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
              Beautiful puzzles, stronger classroom use
            </h2>

            <p className="mt-4 text-[1rem] leading-8 text-slate-300">
              The platform keeps the original MathPickle spirit while giving teachers a cleaner,
              sharper, more usable system for everyday classroom practice.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {whyItWorks.map((text) => (
              <div
                key={text}
                className="rounded-[1.35rem] border border-white/10 bg-white/5 p-5 shadow-soft"
              >
                <div className="text-sm font-medium leading-7 text-white">
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}