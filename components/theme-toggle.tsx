"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("mathpickle-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("mathpickle-theme") as Theme | null;
    const initialTheme: Theme = savedTheme === "light" ? "light" : "dark";
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-ink shadow-soft transition hover:bg-pickle-50 dark:border-white/10 dark:bg-[#1a2230] dark:text-white dark:hover:bg-[#243041]"
    >
      {mounted && theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}