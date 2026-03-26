import Link from "next/link";
import type { Route } from "next";
import { auth } from "@/auth";
import { ButtonLink } from "@/components/ui/button-link";
import { ThemeToggle } from "@/components/theme-toggle";

const publicNav: Array<{ href: Route; label: string }> = [
  { href: "/puzzles", label: "Puzzles" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/teacher-signup", label: "Teachers" },
  { href: "/student-signup", label: "Students" }
];

const teacherNav: Array<{ href: Route; label: string }> = [
  { href: "/puzzles", label: "Puzzles" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/dashboard/teacher", label: "Dashboard" }
];

const studentNav: Array<{ href: Route; label: string }> = [
  { href: "/puzzles", label: "Puzzles" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/dashboard/student", label: "Dashboard" }
];

export async function SiteHeader() {
  const session = await auth();
  const role = session?.user?.role ?? null;

  const nav =
    role === "TEACHER" || role === "ADMIN"
      ? teacherNav
      : role === "STUDENT"
        ? studentNav
        : publicNav;

  const dashboardHref: Route =
    role === "TEACHER" || role === "ADMIN"
      ? "/dashboard/teacher"
      : role === "STUDENT"
        ? "/dashboard/student"
        : "/login";

  const dashboardLabel =
    role === "TEACHER" || role === "ADMIN"
      ? "Teacher dashboard"
      : role === "STUDENT"
        ? "Student dashboard"
        : "Log in";

  const statusText =
    role === "TEACHER" || role === "ADMIN"
      ? "Logged in as teacher"
      : role === "STUDENT"
        ? "Logged in as student"
        : "Classroom puzzle platform";

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-background/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#121826]/96">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pickle-600 text-lg font-bold text-white shadow-soft">
            M
          </div>

          <div>
            <div className="text-[1.15rem] font-semibold tracking-[-0.02em] text-[#556170] transition hover:text-[#44515f] dark:text-[#B7C1CE] dark:hover:text-[#97A3B3]">
              MathPickle
            </div>
            <div className="text-[0.78rem] font-medium text-[#7a8795] dark:text-[#AAB4C2]">
              {statusText}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[0.98rem] font-semibold tracking-[-0.01em] text-[#556170] transition hover:text-[#44515f] dark:text-[#B7C1CE] dark:hover:text-[#97A3B3]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={dashboardHref}
            className="hidden text-[0.95rem] font-semibold tracking-[-0.01em] text-[#556170] transition hover:text-[#44515f] lg:inline-flex dark:text-[#B7C1CE] dark:hover:text-[#97A3B3]"
          >
            {dashboardLabel}
          </Link>

          {role ? (
            <ButtonLink href={dashboardHref}>
              {role === "STUDENT" ? "Student" : "Teacher"}
            </ButtonLink>
          ) : (
            <ButtonLink href="/teacher-signup">Teacher</ButtonLink>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}