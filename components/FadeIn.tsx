"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "framer-motion";

// Plays on page load (not on scroll). Used to stagger the hero entrance.
export default function FadeIn({
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </m.div>
      </LazyMotion>
    </MotionConfig>
  );
}
