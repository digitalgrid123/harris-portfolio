"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggleIcon({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const common = [
    "inline-flex items-center justify-center gap-1.5 h-9 px-2.5 rounded-md text-sm font-medium select-none",
    "text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.04] transition-colors",
    "dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-white/[0.06]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title="Toggle Color Scheme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={common}
    >
      {mounted ? (
        isDark ? (
          <i className="ri-moon-line text-base" aria-hidden="true" />
        ) : (
          <i className="ri-sun-line text-base" aria-hidden="true" />
        )
      ) : (
        <span className="inline-block h-4 w-4 text-base" aria-hidden="true" />
      )}
    </button>
  );
}
