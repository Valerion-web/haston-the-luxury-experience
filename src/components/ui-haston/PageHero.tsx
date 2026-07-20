import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { SplitHeading } from "@/components/ui-haston/Reveal";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; to?: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/30 pb-16 pt-16 md:pb-24 md:pt-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, oklch(0.83 0.035 82 / 0.5), transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-[1600px] px-6 md:px-10">
        {breadcrumb && (
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                {b.to ? (
                  <Link to={b.to} className="hover:text-foreground">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{b.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-eyebrow text-muted-foreground"
          >
            {eyebrow}
          </motion.p>
        )}
        <h1 className="mt-6 max-w-4xl text-display text-5xl leading-[1.02] md:text-7xl">
          <SplitHeading text={title} />
        </h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground"
          >
            {description}
          </motion.p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
