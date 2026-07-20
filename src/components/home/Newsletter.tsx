import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Reveal, SplitHeading } from "@/components/ui-haston/Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground md:py-32">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, oklch(0.83 0.035 82 / 0.35), transparent 50%), radial-gradient(circle at 70% 60%, oklch(0.47 0.045 130 / 0.35), transparent 50%)",
        }}
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.965 0.018 92), transparent 60%)" }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="text-eyebrow opacity-70">The house dispatch</p>
        </Reveal>
        <h2 className="mt-6 text-display text-4xl leading-[1.05] md:text-6xl">
          <SplitHeading text="Letters from" />
          <span className="mt-2 block italic">
            <SplitHeading text="the atelier." />
          </span>
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed opacity-75">
            First looks, private previews, and quiet stories from the workshop — twice a month, in
            considered prose.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="relative mx-auto mt-10 flex max-w-lg items-center gap-2 rounded-full glass-dark p-2 focus-within:ring-2 focus-within:ring-ivory/40"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={done}
              className="flex-1 bg-transparent px-6 py-3 text-sm text-primary-foreground placeholder:opacity-50 focus:outline-none"
            />
            <button
              type="submit"
              className="group grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ivory text-navy transition-all hover:scale-105 active:scale-95"
              aria-label="Subscribe"
            >
              {done ? (
                <Check className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>
        </Reveal>
        {done && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-[11px] uppercase tracking-[0.28em] opacity-70"
          >
            Welcome to the house.
          </motion.p>
        )}
      </div>
    </section>
  );
}
