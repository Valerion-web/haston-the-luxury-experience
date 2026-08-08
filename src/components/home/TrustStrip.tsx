import { Truck, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Truck, title: "Complimentary shipping", sub: "Worldwide over ₹15,000" },
  { icon: RefreshCw, title: "30-day returns", sub: "Free & effortless" },
  { icon: ShieldCheck, title: "Ethically made", sub: "Small-batch European mills" },
  { icon: Sparkles, title: "Lifetime alterations", sub: "At your doorstep, worldwide" },
];

export function TrustStrip() {
  return (
    <section className="relative border-y border-border/60 bg-card">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4 md:px-10">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
            className="flex items-center gap-4"
          >
            <it.icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.24em]">{it.title}</p>
              <p className="text-[11px] text-muted-foreground">{it.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
