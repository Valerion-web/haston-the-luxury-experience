import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { JOURNAL } from "@/lib/haston-data";
import { PageHero } from "@/components/ui-haston/PageHero";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — HASTON" },
      { name: "description", content: "Essays, portraits, and quiet stories from the HASTON atelier." },
    ],
  }),
  component: Journal,
});

const CATS = ["All", "Philosophy", "Craft", "People", "Fabric"];

function Journal() {
  const [cat, setCat] = useState("All");
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  const items = cat === "All" ? JOURNAL : JOURNAL.filter(j => j.category === cat);

  return (
    <>
      <motion.div style={{ scaleX: width }} className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-accent" />
      <PageHero eyebrow="Journal" title="Slow reads from the house."
        description="Essays and portraits. Twice a month, in unhurried prose."
        breadcrumb={[{ label: "Journal" }]}
      >
        <div className="mt-4 flex flex-wrap gap-2">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.24em] transition-colors ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
              {c}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-10">
        {items[0] && (
          <Link to="/journal" className="group relative mb-16 block overflow-hidden rounded-md luxe-shadow">
            <img src={items[0].image} alt="" className="aspect-[16/9] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-primary-foreground md:p-16">
              <p className="text-[10px] uppercase tracking-[0.32em] opacity-70">{items[0].category} · {items[0].read}</p>
              <h2 className="mt-4 max-w-2xl text-display text-4xl md:text-6xl">{items[0].title}</h2>
              <p className="mt-4 max-w-xl opacity-80">{items[0].excerpt}</p>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(1).map((j, i) => (
            <motion.article
              key={j.slug}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="group"
            >
              <Link to="/journal">
                <div className="overflow-hidden rounded-md">
                  <img src={j.image} alt="" className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                </div>
                <p className="mt-6 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{j.category} · {j.read}</p>
                <h3 className="mt-3 text-display text-2xl">{j.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{j.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]">
                  Read <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
