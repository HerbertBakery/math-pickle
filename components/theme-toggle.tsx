"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

function setTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  root.setAttribute("data-theme-ready", "true");
  localStorage.setItem("mathpickle-theme", theme);
}

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme: Theme = root.classList.contains("dark") ? "dark" : "light";
    setThemeState(currentTheme);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setThemeState(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-ink shadow-soft transition hover:bg-pickle-50 dark:border-white/10 dark:bg-[#1a2230] dark:text-white dark:hover:bg-[#243041]"
    >
      {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}