"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "framer-motion";

// Fades content up when it scrolls into view. Pass `delay` (seconds) to stagger
// items in a list. With "reduce motion" on, the movement is skipped.
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <m.div
          className={className}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </m.div>
      </LazyMotion>
    </MotionConfig>
  );
}
