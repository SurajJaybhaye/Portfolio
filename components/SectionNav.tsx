"use client";

import { useEffect, useState } from "react";

const items = [
  { id: "home", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

// Floating pill that highlights the current section. Sections without a pill
// (Skills, Activity) count toward the nearest pill above them. It appears once
// the hero is scrolled past, so the hero stays clean and the pill never sits on
// top of the theme toggle.
export default function SectionNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(items[0].id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * 0.6);
      const line = window.innerHeight * 0.4;
      let current = items[0].id;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom, the last section wins even if it is short.
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        current = items[items.length - 1].id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      aria-label="Sections"
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-4 opacity-0"
      }`}
    >
      <ul className="flex items-center gap-1 rounded-full border border-on-surface/[0.08] dark:border-on-surface/[0.14] bg-surface/80 p-1 shadow-[0_8px_30px_-8px_var(--shadow-dark)] backdrop-blur-md">
        {items.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              className={`block rounded-full px-1.5 py-1.5 text-[10px] font-medium min-[360px]:px-2 min-[360px]:text-[11px] sm:px-4 sm:text-xs tracking-wide transition-colors duration-300 ${
                active === id
                  ? "bg-container-high text-on-surface"
                  : "text-mid hover:text-on-surface"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
