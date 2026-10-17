import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { IMG } from "@/lib/haston-data";
import { SectionHeader } from "@/components/ui-haston/SectionHeader";
import indexTravel from "@/assets/index-travel.jpg";

const tiles = [
  { img: IMG.fabricLinen, label: "Linen, Naturally", meta: "THE ART OF LINEN", span: "" },
  { img: IMG.aboutCraft, label: "Details That Matter", meta: "THE FINER DETAILS", span: "" },
  { img: IMG.aboutHeroEditorial, label: "The Everyday Uniform", meta: "EVERYDAY STYLE", span: "" },
  { img: IMG.fabricKnit, label: "Comfort in Texture", meta: "TEXTURE & COMFORT", span: "" },
  { img: IMG.aboutPhilosophy, label: "The Art of Layering", meta: "THE LAYERING EDIT", span: "" },
  { img: indexTravel, label: "Made for the Journey", meta: "STYLE IN MOTION", span: "" },
];

export function EditorialStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [24, -24]);

  return (
    <section ref={ref} className="relative overflow-hidden texture-linen">
      <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-9">
        <SectionHeader
          eyebrow="Editorial"
          title="The HASTON Index"
          description="Stories on considered menswear, enduring fabrics, thoughtful details, and the pieces that define everyday style."
          link={{ to: "/journal/", label: "Explore journal" }}
        />
        <motion.div
          style={{ y }}
          className="mt-6 grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3 lg:grid-cols-6"
        >
          {tiles.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-sm ${t.span}`}
            >
              <Link to="/journal/" className="block h-full">
                <div className="aspect-square w-full">
                  <img
                    src={t.img}
                    alt={t.label}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-ivory">
                  <p className="text-[7px] uppercase tracking-[0.24em] opacity-75">{t.meta}</p>
                  <p className="mt-1 text-display text-[11px] md:text-xs">{t.label}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
