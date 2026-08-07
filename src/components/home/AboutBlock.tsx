import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { IMG } from "@/lib/haston-data";
import { Reveal, SplitHeading } from "@/components/ui-haston/Reveal";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { CountUp } from "@/components/ui-haston/CountUp";

export function AboutBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section ref={ref} className="mx-auto max-w-[1600px] px-6 py-9 md:px-10 md:py-10">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-24">
        <div className="relative">
          <motion.div style={{ y }} className="relative overflow-hidden rounded-md luxe-shadow">
            <img
              src={IMG.aboutStory}
              alt="HASTON atelier"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </motion.div>
          <div className="absolute -bottom-8 -right-6 hidden glass-panel rounded-md px-6 py-5 md:block">
            <p className="text-eyebrow text-muted-foreground">Established</p>
            <p className="mt-1 text-display text-3xl">Milano, 2016</p>
          </div>
        </div>

        <div>
          <Reveal>
            <p className="text-eyebrow text-muted-foreground">The house</p>
          </Reveal>
          <h2 className="mt-4 text-display text-4xl leading-[1.05] md:text-3xl">
            <SplitHeading text="Made for the men" />
            <span className="mt-1 block italic">
              <SplitHeading text="who dress with intention." />
            </span>
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">
              HASTON began in a Milan atelier with a simple discipline — that the best casual wear
              should feel considered. Nine years on, every piece still starts with the fabric, and
              ends in a small European workshop we know by name.
            </p>
          </Reveal>

          <div className="mt-6 grid grid-cols-3 gap-6 hairline pt-10">
            {[
              { n: 240, s: "+", l: "Artisans" },
              { n: 60, s: "%", l: "Natural fibers" },
              { n: 12, s: "", l: "Global ateliers" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div>
                  <p className="text-display text-4xl md:text-3xl">
                    <CountUp end={s.n} />
                    <span className="text-accent">{s.s}</span>
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    {s.l}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-6">
              <LuxeButton to="/about" variant="outline" arrow>
                Our story
              </LuxeButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
