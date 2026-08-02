import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { IMG } from "@/lib/haston-data";
import { Reveal, SplitHeading } from "@/components/ui-haston/Reveal";

type Banner = {
  title: string;
  subtitle: string;
  cta: string;
  to: string;
  image: string;
};

const BANNERS: Banner[] = [
  {
    title: "Linen Collection",
    subtitle: "Light. Breathable. Naturally Refined.",
    cta: "Shop Linen",
    to: "/collections/shirts",
    image: IMG.lb1,
  },
  {
    title: "Denim Edit",
    subtitle: "Timeless Fits. Everyday Essential.",
    cta: "Shop Denim",
    to: "/collections/trousers",
    image: IMG.lb3,
  },
  {
    title: "Weekend Essentials",
    subtitle: "Relaxed Comfort. Elevated Style.",
    cta: "Explore Collection",
    to: "/collections/knitwear",
    image: IMG.lb2,
  },
];

function BannerCard({ banner, index }: { banner: Banner; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link to={banner.to} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md luxe-shadow transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
          <motion.img
            src={banner.image}
            alt={banner.title}
            loading="lazy"
            style={{ y }}
            className="absolute inset-0 h-[115%] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-primary/10 transition-opacity duration-500 group-hover:opacity-80" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-8 text-ivory md:p-10">
            <h3 className="text-display text-3xl uppercase tracking-wide transition-transform duration-500 group-hover:-translate-y-1.5 md:text-4xl lg:text-3xl">
              {banner.title}
            </h3>
            <p className="max-w-xs text-sm leading-relaxed opacity-85 md:text-base">
              {banner.subtitle}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em]">
              <span className="relative">
                {banner.cta}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-100 bg-current transition-transform duration-500 group-hover:origin-right group-hover:scale-x-0" />
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedCasualCollections() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-14 md:px-10 md:py-10">
      <div className="mb-8 flex flex-col gap-6 md:mb-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <Reveal>
            <p className="text-eyebrow text-muted-foreground">Featured casual collections</p>
          </Reveal>
          <h2 className="mt-4 text-display text-4xl leading-[1.05] md:text-3xl">
            <SplitHeading text="Curated edits" />
            <span className="mt-1 block italic">
              <SplitHeading text="for every day." />
            </span>
          </h2>
        </div>
        <Reveal delay={0.2}>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
            Three edits built around the fabrics we return to season after season — linen, denim, and
            the quiet essentials that carry a weekend.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {BANNERS.map((b, i) => (
          <div
            key={b.title}
            className={i === 2 ? "md:col-span-2 md:mx-auto md:w-1/2 lg:col-span-1 lg:mx-0 lg:w-auto" : ""}
          >
            <BannerCard banner={b} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
