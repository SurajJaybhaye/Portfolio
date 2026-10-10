"use client";

import { useEffect, useRef } from "react";

// Starts a horizontally scrollable area at its right end (latest data).
// Focusable and labelled so keyboard users can scroll it too.
export default function ScrollEnd({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);
  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      tabIndex={0}
      className="overflow-x-auto pb-2"
    >
      {children}
    </div>
  );
}
