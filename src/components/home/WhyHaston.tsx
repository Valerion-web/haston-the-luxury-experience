import { Feather, Sprout, Hand, Compass, Award, Scissors } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui-haston/SectionHeader";

const items = [
  { icon: Feather, title: "Featherweight fabrics", body: "Cashmere, linen and long-staple cotton sourced from single mills we've partnered with for years." },
  { icon: Scissors, title: "Considered cuts", body: "Silhouettes drafted in-house, tuned across ten fittings before a single meter is cut." },
  { icon: Hand, title: "Small-batch making", body: "Every piece leaves a European workshop by name — never a nameless factory floor." },
  { icon: Sprout, title: "Naturally sourced", body: "Over 60% of our materials are natural fibers, traced back to origin." },
  { icon: Award, title: "Lifetime alterations", body: "Free tailoring for the life of the garment. In-store, worldwide." },
  { icon: Compass, title: "Independent house", body: "House of Valerion remains family-owned. Slower decisions, quieter design." },
];

export function WhyHaston() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 50%)" }} />
      <div className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
        <SectionHeader
          eyebrow="Why HASTON"
          title="Six commitments. One standard."
          description="The quiet principles behind every seam."
        />
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-md glass-dark p-8"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
                   style={{ background: "radial-gradient(circle, oklch(0.83 0.035 82), transparent 60%)" }} />
              <div className="relative">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-primary-foreground/20 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <it.icon className="h-5 w-5" strokeWidth={1.4} />
                </div>
                <h3 className="mt-6 text-display text-2xl">{it.title}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-80">{it.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
