import { motion } from "framer-motion";
import { Reveal, SplitHeading } from "@/components/ui-haston/Reveal";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";

export function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-primary py-9 text-primary-foreground md:py-10">
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
          <p className="text-eyebrow opacity-70">THE HASTON EDIT</p>
        </Reveal>
        <h2 className="mt-6 text-display text-4xl leading-[1.05] md:text-3xl">
          <SplitHeading text="Wear what" />
          <span className="mt-2 block italic">
            <SplitHeading text="defines you." />
          </span>
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed opacity-75">
            Discover refined essentials, modern silhouettes, and pieces that make everyday dressing
            feel exceptional.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <LuxeButton to="/shop" variant="ivory" arrow className="mt-6">
            Explore the collection
          </LuxeButton>
        </Reveal>
      </div>
    </section>
  );
}
