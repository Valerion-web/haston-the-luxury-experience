import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { IMG } from "@/lib/haston-data";
import { SectionHeader } from "@/components/ui-haston/SectionHeader";

const shots = [
  { src: IMG.lb1, tag: "Portofino, Italy", title: "The overshirt" },
  { src: IMG.lb2, tag: "Studio 04", title: "Cashmere study" },
  { src: IMG.lb3, tag: "Milan atelier", title: "Detail 07" },
  { src: IMG.hero, tag: "Casa Valerion", title: "Ivory light" },
  { src: IMG.collectionBanner, tag: "Vol. 07", title: "The autumn edit" },
];

export function Lookbook() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-40%"]);

  return (
    <section ref={ref} className="relative py-14 md:py-10">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <SectionHeader
          eyebrow="Lookbook"
          title="Vol. 07 — a study in stillness."
          link={{ to: "/lookbook", label: "View the full edit" }}
        />
      </div>
      <div className="mt-8 overflow-hidden">
        <motion.div style={{ x }} className="flex gap-6 pl-6 md:pl-10">
          {shots.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5 }}
              className="relative w-[75vw] shrink-0 overflow-hidden rounded-md luxe-shadow sm:w-[420px] md:w-[520px]"
            >
              <img
                src={s.src}
                alt={s.title}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-6 text-primary-foreground">
                <p className="text-[10px] uppercase tracking-[0.32em] opacity-70">{s.tag}</p>
                <p className="mt-2 text-display text-2xl">{s.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
