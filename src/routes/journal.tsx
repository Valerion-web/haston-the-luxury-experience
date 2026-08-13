import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { JOURNAL, IMG } from "@/lib/haston-data";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SplitHeading } from "@/components/ui-haston/Reveal";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — HASTON" },
      {
        name: "description",
        content:
          "The HASTON Journal — notes on philosophy, craft, people and fabric from a house that believes luxury should be felt.",
      },
      { property: "og:title", content: "The HASTON Journal" },
      {
        property: "og:description",
        content: "Philosophy, craft, people and fabric — the thinking behind every HASTON piece.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Journal,
});

const CATS = ["All", "Philosophy", "Craft", "People", "Fabric"];

function Journal() {
  const [cat, setCat] = useState("All");
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  const items = cat === "All" ? JOURNAL : JOURNAL.filter((j) => j.category === cat);

  return (
    <>
      <motion.div
        style={{ scaleX: width }}
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-accent"
      />

      {/* Editorial hero */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <motion.img
          src={IMG.journalHero}
          alt=""
          aria-hidden
          loading="eager"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/92 via-navy/60 to-navy/30" />
        <div className="relative mx-auto flex min-h-[360px] max-w-[1600px] flex-col justify-end px-5 py-12 md:min-h-[460px] md:px-10 md:py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-8 bg-sand" />
            <p className="text-eyebrow text-sand">The Journal</p>
          </motion.div>
          <h1 className="mt-4 max-w-3xl text-display text-[1.7rem] leading-[1.12] text-primary-foreground sm:text-[2.2rem] md:text-[2.8rem]">
            <SplitHeading text="Philosophy, craft, people, fabric." />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-4 max-w-xl text-[11.5px] leading-relaxed text-primary-foreground/80"
          >
            Four notes on how we think, how we make, and why luxury at HASTON is something felt
            rather than displayed.
          </motion.p>

          <div className="mt-5 flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-2 text-[9px] uppercase tracking-[0.2em] backdrop-blur-md transition-colors ${
                  cat === c
                    ? "border-sand bg-sand text-navy"
                    : "border-primary-foreground/30 text-primary-foreground/80 hover:border-primary-foreground/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature */}
      <section className="mx-auto max-w-[1600px] px-6 py-9 md:px-10">
        {items[0] && (
          <Link
            to="/journal/$slug"
            params={{ slug: items[0].slug }}
            className="group relative mb-8 block overflow-hidden rounded-md luxe-shadow"
          >
            <img
              src={items[0].image}
              alt=""
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105 md:aspect-[16/7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground md:p-12">
              <p className="text-[9px] uppercase tracking-[0.28em] text-sand">
                {items[0].number} — {items[0].category} · {items[0].read} read
              </p>
              <h2 className="mt-3 max-w-2xl text-display text-xl leading-tight md:text-3xl">
                {items[0].title}
              </h2>
              <p className="mt-3 max-w-xl text-[12px] leading-relaxed opacity-80">
                {items[0].excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]">
                Read the entry
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(1).map((j, i) => (
            <motion.article
              key={j.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="group"
            >
              <Link to="/journal/$slug" params={{ slug: j.slug }}>
                <div className="overflow-hidden rounded-md">
                  <img
                    src={j.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                  {j.number} — {j.category} · {j.read} read
                </p>
                <h3 className="mt-2 text-display text-lg leading-snug md:text-xl">{j.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                  {j.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]">
                  Read
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
