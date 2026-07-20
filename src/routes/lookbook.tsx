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
  { src: IMG.hero, tag: "01 · Ivory light", title: "The linen shirt" },
  { src: IMG.lb1, tag: "02 · Portofino", title: "The overshirt" },
  { src: IMG.lb2, tag: "03 · Studio 04", title: "Cashmere study" },
  { src: IMG.lb3, tag: "04 · Detail", title: "Buttons, by hand" },
  { src: IMG.collectionBanner, tag: "05 · Casa Valerion", title: "The overcoat" },
  { src: IMG.aboutStory, tag: "06 · Milano", title: "In the atelier" },
];

function Lookbook() {
  return (
    <>
      <PageHero
        eyebrow="Vol. 07"
        title="A study in stillness."
        description="Autumn / Winter — sixty pieces photographed across Milan, Portofino and Casa Valerion."
        breadcrumb={[{ label: "Lookbook" }]}
      />

      <div className="mx-auto max-w-[1600px] space-y-24 px-6 py-24 md:px-10 md:py-32">
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
  reverse,
}: {
  src: string;
  tag: string;
  title: string;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  return (
    <div
      ref={ref}
      className={`grid items-center gap-10 md:grid-cols-[1.4fr_1fr] md:gap-20 ${reverse ? "md:grid-flow-dense" : ""}`}
    >
      <motion.div
        className={`overflow-hidden rounded-md luxe-shadow ${reverse ? "md:col-start-2" : ""}`}
        style={{ y }}
      >
        <motion.img
          src={src}
          alt={title}
          style={{ scale }}
          className="aspect-[4/5] w-full object-cover"
        />
      </motion.div>
      <div>
        <p className="text-eyebrow text-muted-foreground">{tag}</p>
        <h3 className="mt-4 text-display text-4xl leading-[1.05] md:text-6xl">{title}</h3>
      </div>
    </div>
  );
}
