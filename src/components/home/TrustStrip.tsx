import { Truck, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const items = [
  { icon: Truck, title: "Complimentary shipping" },
  { icon: RefreshCw, title: "5-day returns", sub: "Free & effortless" },
  { icon: ShieldCheck, title: "Ethically made" },
  { icon: Sparkles, title: "Lifetime alterations" },
  { icon: ShieldCheck, title: "Secure payments", sub: "Razorpay · Visa · UPI · COD" },
  { icon: Truck, title: "Reliable delivery" },
];

export function TrustStrip() {
  const reduceMotion = useReducedMotion();

  const renderItems = (duplicate = false) => (
    <div
      aria-hidden={duplicate || undefined}
      className={`flex w-max shrink-0 gap-6 md:gap-7 lg:gap-8 ${duplicate ? "hidden lg:flex" : ""}`}
    >
      {items.map((it, i) => (
        <motion.div
          key={it.title}
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.08 }}
          className="trust-strip-item flex min-h-12 min-w-64 shrink-0 snap-start items-center gap-3"
        >
          <it.icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
          <div className="flex min-w-0 flex-col justify-center">
            <p className="whitespace-nowrap text-[11px] leading-4 uppercase tracking-[0.24em]">
              {it.title}
            </p>
            {it.sub && (
              <p className="whitespace-nowrap text-[11px] leading-4 text-muted-foreground">
                {it.sub}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="relative border-y border-border/60 bg-card">
      <div
        aria-label="HASTON benefits"
        className="trust-strip mx-auto max-w-[1600px] snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-6 py-10 scroll-smooth lg:snap-none lg:overflow-hidden lg:px-10"
        role="region"
        tabIndex={0}
      >
        <div className="trust-strip-track flex w-max lg:animate-trust-marquee">
          {renderItems()}
          {renderItems(true)}
        </div>
      </div>
    </section>
  );
}
