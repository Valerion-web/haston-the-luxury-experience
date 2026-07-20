import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { IMG } from "@/lib/haston-data";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { SplitHeading, Reveal } from "@/components/ui-haston/Reveal";

export function FeaturedCollection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-primary text-primary-foreground">
      <motion.div style={{ scale, y }} className="absolute inset-0 opacity-40">
        <img src={IMG.collectionBanner} alt="" className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/60 to-primary/85" />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 py-32 md:grid-cols-[1fr_1fr] md:px-10 md:py-44">
        <div>
          <Reveal>
            <p className="text-eyebrow opacity-70">The autumn edit</p>
          </Reveal>
          <h2 className="mt-6 text-display text-5xl leading-[1.02] md:text-7xl">
            <SplitHeading text="Considered layers for" />
            <span className="mt-2 block italic">
              <SplitHeading text="slower days." />
            </span>
          </h2>
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-md text-base leading-relaxed opacity-80">
              Sixty pieces conceived around wool, cashmere and heritage cotton — cut to move with
              you from long lunches to longer evenings.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-10 flex flex-wrap gap-4">
              <LuxeButton to="/collections/new-arrivals" variant="ivory" arrow>
                Shop the edit
              </LuxeButton>
              <LuxeButton to="/lookbook" variant="outline" className="text-ivory">
                See the lookbook
              </LuxeButton>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[IMG.lb2, IMG.lb3].map((src, i) => (
            <motion.div
              key={i}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`overflow-hidden rounded-md luxe-shadow ${i === 0 ? "mt-16" : ""}`}
            >
              <img src={src} alt="" className="aspect-[3/4] w-full object-cover transition-transform duration-[1400ms] hover:scale-110" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
