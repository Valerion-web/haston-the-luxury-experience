import { createFileRoute } from "@tanstack/react-router";
import { STORES } from "@/lib/haston-data";
import { PageHero } from "@/components/ui-haston/PageHero";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/store-locator")({
  head: () => ({
    meta: [
      { title: "Store Locator — HASTON" },
      { name: "description", content: "Find a HASTON store worldwide." },
    ],
  }),
  component: StoreLocator,
});

function StoreLocator() {
  return (
    <>
      <PageHero
        eyebrow="Stores"
        title="Visit the house."
        description="Twelve ateliers, worldwide. Private appointments on request."
        breadcrumb={[{ label: "Stores" }]}
      />
      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STORES.map((s, i) => (
            <motion.div
              key={s.city}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-md border border-border bg-card p-8 soft-shadow transition-shadow hover:luxe-shadow"
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
                style={{
                  background: "radial-gradient(circle, oklch(0.83 0.035 82), transparent 60%)",
                }}
              />
              <p className="text-eyebrow text-muted-foreground">Boutique</p>
              <h3 className="mt-4 text-display text-4xl">{s.city}</h3>
              <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.4} />{" "}
                  {s.address}
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.4} /> {s.phone}
                </p>
                <p className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.4} /> {s.hours}
                </p>
              </div>
              <button className="mt-8 text-[11px] uppercase tracking-[0.28em] underline">
                Book an appointment
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
