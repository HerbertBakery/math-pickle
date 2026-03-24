import Link from "next/link";
import { auth } from "@/auth";
import { ButtonLink } from "@/components/ui/button-link";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/puzzles", label: "Puzzles" },
  { href: "/leaderboards", label: "Leaderboards" }
];

function getDashboardHref(role?: "ADMIN" | "TEACHER" | "STUDENT") {
  if (role === "TEACHER" || role === "ADMIN") return "/dashboard/teacher";
  if (role === "STUDENT") return "/dashboard/student";
  return "/login";
}

function getRoleLabel(role?: "ADMIN" | "TEACHER" | "STUDENT") {
  if (role === "TEACHER") return "Teacher";
  if (role === "STUDENT") return "Student";
  if (role === "ADMIN") return "Admin";
  return "";
}

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;
  const dashboardHref = getDashboardHref(user?.role);
  const roleLabel = getRoleLabel(user?.role);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-background/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#121826]/96">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pickle-600 text-lg font-bold text-white shadow-soft">
            M
          </div>

          <div>
            <div className="text-[1.18rem] font-semibold tracking-[-0.03em] text-[#4d5967] transition hover:text-ink dark:text-[#F2F4F8] dark:hover:text-white">
              MathPickle
            </div>
            <div className="text-[0.8rem] font-medium text-[#7b8794] dark:text-[#B8C1CD]">
              puzzles for real classrooms
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[0.98rem] font-semibold tracking-[-0.01em] text-[#556170] transition hover:text-ink dark:text-[#E6EAF0] dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 lg:gap-4">
          {user ? (
            <>
              <div className="hidden items-center gap-3 rounded-full border border-line bg-white/90 px-3 py-2 shadow-soft dark:border-white/10 dark:bg-white/5 md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pickle-600 text-sm font-bold text-white">
                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-ink dark:text-white">
                    {user.name || user.email}
                  </div>
                  <div className="text-xs font-medium text-muted dark:text-slate-300">
                    {roleLabel} account active
                  </div>
                </div>
              </div>

              <ButtonLink href={dashboardHref}>
                {user.role === "STUDENT" ? "Student Dashboard" : "Teacher Dashboard"}
              </ButtonLink>
            </>
          ) : (
            <>
              <div className="hidden items-center gap-6 lg:flex">
                <Link
                  href="/teacher-signup"
                  className="text-[0.98rem] font-semibold tracking-[-0.01em] text-[#556170] transition hover:text-ink dark:text-[#E6EAF0] dark:hover:text-white"
                >
                  Teachers
                </Link>
                <Link
                  href="/student-signup"
                  className="text-[0.98rem] font-semibold tracking-[-0.01em] text-[#556170] transition hover:text-ink dark:text-[#E6EAF0] dark:hover:text-white"
                >
                  Students
                </Link>
              </div>

              <ButtonLink href="/teacher-signup">Teacher</ButtonLink>
            </>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}