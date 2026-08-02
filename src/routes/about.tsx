import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { IMG } from "@/lib/haston-data";
import { PageHero } from "@/components/ui-haston/PageHero";
import { Reveal, SplitHeading } from "@/components/ui-haston/Reveal";
import { CountUp } from "@/components/ui-haston/CountUp";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — HASTON by House of Valerion" },
      {
        name: "description",
        content:
          "The story of HASTON — a Milan-founded menswear house building considered, casual pieces with unhurried craft.",
      },
      { property: "og:title", content: "About HASTON" },
      { property: "og:description", content: "Casual wear, considered." },
      { property: "og:image", content: IMG.aboutStory },
    ],
  }),
  component: About,
});

function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <>
      <PageHero
        eyebrow="The house"
        title="Casual wear, considered."
        description="HASTON began with a discipline — every casual piece deserves the same care as a bespoke suit. A decade on, that hasn't changed."
        breadcrumb={[{ label: "About" }]}
      />

      <section ref={ref} className="mx-auto max-w-[1600px] px-6 py-14 md:px-10 md:py-10">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <motion.div style={{ y }} className="overflow-hidden rounded-md luxe-shadow">
            <img src={IMG.aboutStory} alt="" className="aspect-[4/5] w-full object-cover" />
          </motion.div>
          <div>
            <p className="text-eyebrow text-muted-foreground">Chapter one</p>
            <h2 className="mt-4 text-display text-4xl leading-[1.05] md:text-3xl">
              <SplitHeading text="Founded in Milano, 2016." />
            </h2>
            <Reveal delay={0.2}>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  House of Valerion opened a small atelier off Via della Spiga with a single idea —
                  that casual wear had been left behind. Jackets and suits carried craft. Shirts,
                  sweaters and trousers, mostly, did not.
                </p>
                <p>
                  HASTON is our answer. Every piece begins with a fabric visit — most often to a
                  mill we've known for years. Then a paper block. Then twenty fittings. Then,
                  sometimes, we still start again.
                </p>
                <p>
                  Today, thirty-eight people work under our roof across Milan, London and Mumbai.
                  Small enough to know our tailors by name. Large enough to make things properly.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-primary py-14 text-primary-foreground md:py-10">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-8 px-6 md:grid-cols-4 md:px-10">
          {[
            { n: 240, s: "+", l: "Artisans in our workshops" },
            { n: 60, s: "%", l: "Natural fibers, every collection" },
            { n: 12, s: "", l: "Global ateliers & stores" },
            { n: 9, s: "yr", l: "Since our first collection" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <p className="text-display text-3xl md:text-3xl">
                <CountUp end={s.n} />
                <span className="text-accent">{s.s}</span>
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.28em] opacity-70">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-14 md:px-10 md:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <p className="text-eyebrow text-muted-foreground">Materials</p>
            <h2 className="mt-4 text-display text-4xl leading-[1.05]">Fibre first.</h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              We source in small volumes from single mills — Fox Brothers in Somerset, Loro Piana in
              Piedmont, Bonotto near Venice. If we can't trace a fibre to its origin, we don't buy
              it.
            </p>
          </div>
          <div>
            <p className="text-eyebrow text-muted-foreground">Making</p>
            <h2 className="mt-4 text-display text-4xl leading-[1.05]">Slow by design.</h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Every piece is finished by hand — buttonholes on the shirts, buttons on the jackets,
              hems on the trousers. It costs us more. It costs the piece less.
            </p>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <LuxeButton to="/journal" variant="outline" arrow>
            Read the journal
          </LuxeButton>
        </div>
      </section>
    </>
  );
}
