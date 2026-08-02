import { motion, type Variants } from "framer-motion";
import type { ComponentType, ElementType, ReactNode } from "react";

const base: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export function Reveal({
  children,
  delay = 0,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const MotionAs = motion(As as Parameters<typeof motion>[0]) as ComponentType<Record<string, unknown>>;
  return (
    <MotionAs
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: base.hidden,
        show: { ...base.show, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay } },
      }}
      className={className}
    >
      {children}
    </MotionAs>
  );
}

export function SplitHeading({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.16em] pr-[0.22em] align-top leading-[1.22]">
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
