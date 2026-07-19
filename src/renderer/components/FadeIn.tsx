import { motion } from "motion/react";
import type { ReactNode } from "react";

// Shared entrance animation: content fades in and rises slightly. Used
// whenever a block appears in place (results, logs, previews) so new content
// never just pops into the layout.
export default function FadeIn({
  children,
  className,
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  // Stagger offset in seconds for lists of appearing blocks.
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
