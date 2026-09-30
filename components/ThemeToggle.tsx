"use client";

import { LuSun, LuMoon } from "react-icons/lu";

export default function ThemeToggle() {
  const apply = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  };

  const toggle = () => {
    // Crossfade the whole page where the browser supports it; otherwise switch instantly.
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "startViewTransition" in document) {
      (
        document as Document & {
          startViewTransition: (cb: () => void) => unknown;
        }
      ).startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="neumorphic-sm absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-on-surface/[0.06] bg-container-low text-lg transition-colors hover:bg-container-high md:right-10 md:top-10"
    >
      <LuMoon aria-hidden className="dark:hidden" />
      <LuSun aria-hidden className="hidden dark:block" />
    </button>
  );
}
