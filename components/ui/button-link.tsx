import Link from "next/link";
import { cn } from "@/lib/utils";

export function ButtonLink({
  href,
  children,
  variant = "primary"
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-[0.96rem] font-semibold tracking-[-0.01em] transition",
        variant === "primary" &&
          "bg-pickle-600 text-white hover:bg-pickle-700",
        variant === "secondary" &&
          "border border-line bg-white text-ink hover:bg-background dark:bg-[#1a1f29] dark:text-[#E0E0E0] dark:hover:bg-[#222938]",
        variant === "ghost" &&
          "text-[#5a6775] hover:bg-black/5 hover:text-ink dark:text-[#E0E0E0] dark:hover:bg-white/5 dark:hover:text-[#FAFAFA]"
      )}
    >
      {children}
    </Link>
  );
}