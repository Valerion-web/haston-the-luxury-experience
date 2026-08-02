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
  return (
    <div
      className={`flex flex-col gap-8 md:flex-row md:items-end md:justify-between ${
        align === "center" ? "text-center md:flex-col md:items-center" : ""
      }`}
    >
      <div className={`max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
        {eyebrow && (
          <Reveal>
            <p className="text-eyebrow text-muted-foreground">{eyebrow}</p>
          </Reveal>
        )}
        <h2 className="mt-4 text-display text-4xl leading-[1.05] md:text-3xl">
          <SplitHeading text={title} />
        </h2>
        {description && (
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Reveal>
        )}
      </div>
      {link && (
        <Reveal delay={0.2}>
          <Link
            to={link.to}
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]"
          >
            <span className="relative">
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0" />
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </Reveal>
      )}
    </div>
  );
}
