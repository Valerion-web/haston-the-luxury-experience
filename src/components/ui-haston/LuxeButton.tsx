import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost" | "ivory";
const styles: Record<Variant, string> = {
  solid:
    "bg-primary text-primary-foreground border border-primary hover:shadow-[0_10px_30px_-12px_oklch(0.24_0.05_258/0.6)]",
  outline:
    "border border-current bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary",
  ghost: "bg-transparent hover:bg-foreground/5",
  ivory:
    "bg-ivory text-navy border border-ivory hover:shadow-[0_10px_30px_-10px_oklch(0.965_0.018_92/0.45)]",
};

type Props = {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
  type?: "button" | "submit";
};

export function LuxeButton({
  children,
  to,
  onClick,
  variant = "solid",
  className = "",
  arrow,
  type = "button",
}: Props) {
  const cls = `group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[9px] uppercase tracking-[0.24em] transition-all duration-500 hover:-translate-y-[1px] ${styles[variant]} ${className}`;
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && (
        <ArrowUpRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
      )}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </>
  );
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
