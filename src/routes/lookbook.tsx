import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";
import { IMG } from "@/lib/haston-data";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Lookbook — HASTON" },
      { name: "description", content: "The autumn / winter lookbook — Vol. 07." },
      { property: "og:image", content: IMG.collectionBanner },
    ],
  }),
  component: Lookbook,
});

const shots = [
  {
    src: IMG.hero,
    tag: "01 · Ivory light",
    title: "The linen shirt",
    copy: "Irish linen, washed twice for a lived-in drape. Worn open over a fine cotton tee.",
  },
  {
    src: IMG.lb1,
    tag: "02 · Portofino",
    title: "The overshirt",
    copy: "Garment-dyed cotton twill in olive — a jacket that behaves like a shirt.",
  },
  {
    src: IMG.lb2,
    tag: "03 · Studio 04",
    title: "Cashmere study",
    copy: "Inner-Mongolian cashmere, two-ply, knitted on vintage gauge machines.",
  },
  {
    src: IMG.lb3,
    tag: "04 · Detail",
    title: "Buttons, by hand",
    copy: "Mother-of-pearl, shanked and set by hand in our Milanese atelier.",
  },
  {
    src: IMG.collectionBanner,
    tag: "05 · Casa Valerion",
    title: "The overcoat",
    copy: "Unstructured shoulder, wool-alpaca melton, cut for winter travel.",
  },
  {
    src: IMG.aboutStory,
    tag: "06 · Milano",
    title: "In the atelier",
    copy: "Where every HASTON pattern is drawn, cut and corrected before release.",
  },
];

function Lookbook() {
  return (
    <>
      <PageHero
        eyebrow="Vol. 07"
        title="Modern casual editorial."
        description="Autumn / Winter — sixty pieces photographed across Milan, Portofino and Casa Valerion."
        breadcrumb={[{ label: "Lookbook" }]}
        image={IMG.heroLookbook}
      />

      <div className="mx-auto max-w-[1600px] space-y-10 px-5 py-8 md:space-y-14 md:px-8 md:py-10">
        {shots.map((s, i) => (
          <Shot key={i} {...s} reverse={i % 2 === 1} />
        ))}
      </div>
    </>
  );
}

function Shot({
  src,
  tag,
  title,
  copy,
  reverse,
}: {
  src: string;
  tag: string;
  title: string;
  copy: string;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  return (
    <div
      ref={ref}
      className={`grid items-center gap-5 md:grid-cols-[1.6fr_1fr] md:gap-10 ${reverse ? "md:grid-flow-dense" : ""}`}
    >
      <motion.div
        className={`overflow-hidden rounded-md soft-shadow ${reverse ? "md:col-start-2" : ""}`}
        style={{ y }}
      >
        <motion.img
          src={src}
          alt={title}
          loading="lazy"
          decoding="async"
          style={{ scale }}
          className="aspect-[16/11] w-full object-cover md:aspect-[5/4]"
        />
      </motion.div>
      <div>
        <p className="text-eyebrow text-muted-foreground">{tag}</p>
        <h3 className="mt-3 text-display text-xl leading-[1.12] md:text-2xl">{title}</h3>
        <div className="mt-4 h-px w-20 bg-gradient-to-r from-sand to-transparent" />
        <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-muted-foreground">{copy}</p>
      </div>
    </div>
  );
}

