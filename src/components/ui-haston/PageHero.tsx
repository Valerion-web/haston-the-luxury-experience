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
  image,
  align = "start",
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; to?: string }[];
  /** Full-width lifestyle banner. When omitted a compact tinted hero is used. */
  image?: string;
  align?: "start" | "center";
  children?: ReactNode;
}) {
  const centered = align === "center";
  const onImage = Boolean(image);

  const crumbs = breadcrumb && (
    <motion.nav
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className={`flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.24em] ${
        onImage ? "text-primary-foreground/65" : "text-muted-foreground"
      } ${centered ? "justify-center" : ""}`}
    >
      <Link to="/" className="transition-opacity hover:opacity-60">
        Home
      </Link>
      {breadcrumb.map((b, i) => (
        <span key={i} className="flex items-center gap-2">
          <ChevronRight className="h-3 w-3 opacity-60" />
          {b.to ? (
            <Link to={b.to} className="transition-opacity hover:opacity-60">
              {b.label}
            </Link>
          ) : (
            <span className={onImage ? "text-primary-foreground" : "text-foreground"}>
              {b.label}
            </span>
          )}
        </span>
      ))}
    </motion.nav>
  );

  const body = (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-4xl"}>
      {crumbs}
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`mt-5 flex items-center gap-3 ${centered ? "justify-center" : ""}`}
        >
          <span className={`h-px w-8 ${onImage ? "bg-sand" : "bg-sand"}`} />
          <p className={`text-eyebrow ${onImage ? "text-sand" : "text-gold"}`}>{eyebrow}</p>
        </motion.div>
      )}
      <h1
        className={`mt-4 text-display text-[1.6rem] leading-[1.1] sm:text-[2.1rem] md:text-[2.6rem] ${
          onImage ? "text-primary-foreground" : ""
        }`}
      >
        <SplitHeading text={title} />
      </h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className={`mt-4 max-w-xl text-[11.5px] leading-relaxed tracking-[0.02em] ${
            centered ? "mx-auto" : ""
          } ${onImage ? "text-primary-foreground/80" : "text-muted-foreground"}`}
        >
          {description}
        </motion.p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );

  if (!onImage) {
    return (
      <section className="relative overflow-hidden border-b border-border bg-secondary/25 py-7 md:py-9">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 85% 15%, oklch(0.83 0.035 82 / 0.55), transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-[1600px] px-5 md:px-8">{body}</div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <motion.img
        src={image}
        alt=""
        aria-hidden
        loading="eager"
        decoding="async"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/60 to-navy/35" />
      <div className="relative mx-auto flex min-h-[300px] max-w-[1600px] items-center px-5 py-12 md:min-h-[400px] md:px-8 md:py-16">
        {body}
      </div>
    </section>
  );
}
