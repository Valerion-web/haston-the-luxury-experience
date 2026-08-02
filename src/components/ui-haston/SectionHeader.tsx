import { Reveal, SplitHeading } from "./Reveal";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  link,
  align = "start",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { to: string; label: string };
  align?: "start" | "center";
}) {
  const centered = align === "center";
  return (
    <div
      className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${
        centered ? "text-center md:flex-col md:items-center" : ""
      }`}
    >
      <div className={`max-w-3xl ${centered ? "mx-auto" : ""}`}>
        {eyebrow && (
          <Reveal>
            <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
              <span className="h-px w-8 bg-sand" />
              <p className="text-eyebrow text-gold">{eyebrow}</p>
              {centered && <span className="h-px w-8 bg-sand" />}
            </div>
          </Reveal>
        )}
        <h2 className="mt-3 text-display text-xl leading-[1.15] sm:text-2xl md:text-[2rem]">
          <SplitHeading text={title} />
        </h2>
        <div
          className={`mt-4 h-px w-24 bg-gradient-to-r from-sand to-transparent ${
            centered ? "mx-auto from-sand via-sand/40 to-transparent" : ""
          }`}
        />
        {description && (
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-xl text-[11px] leading-relaxed tracking-[0.02em] text-muted-foreground">
              {description}
            </p>
          </Reveal>
        )}
      </div>
      {link && (
        <Reveal delay={0.2}>
          <Link
            to={link.to}
            className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]"
          >
            <span className="relative">
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0" />
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </Reveal>
      )}
    </div>
  );
}
