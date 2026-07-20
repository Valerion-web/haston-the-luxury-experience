import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost" | "ivory";
const styles: Record<Variant, string> = {
  solid:
    "bg-primary text-primary-foreground border border-primary hover:bg-primary/90",
  outline:
    "border border-current bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary",
  ghost: "bg-transparent hover:bg-foreground/5",
  ivory:
    "bg-ivory text-navy border border-ivory hover:bg-transparent hover:text-ivory",
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
  children, to, onClick, variant = "solid", className = "", arrow, type = "button",
}: Props) {
  const cls = `group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4 text-[11px] uppercase tracking-[0.28em] transition-all duration-500 ${styles[variant]} ${className}`;
  const inner = (
    <>
      <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-[1px]">
        {children}
      </span>
      {arrow && (
        <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
      )}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </>
  );
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
