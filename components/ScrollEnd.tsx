"use client";

import { useEffect, useRef } from "react";

// Starts a horizontally scrollable area at its right end (latest data).
export default function ScrollEnd({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);
  return (
    <div ref={ref} className="overflow-x-auto pb-2">
      {children}
    </div>
  );
}
