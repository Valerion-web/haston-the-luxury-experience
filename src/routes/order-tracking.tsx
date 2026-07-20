import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/ui-haston/PageHero";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { Package, Truck, MapPin, Check } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/order-tracking")({
  head: () => ({
    meta: [
      { title: "Order Tracking — HASTON" },
      { name: "description", content: "Track your HASTON order in real time." },
    ],
  }),
  component: Track,
});

const steps = [
  { icon: Check, title: "Order placed", note: "May 18 · 10:14 CET", done: true },
  { icon: Package, title: "Prepared in atelier", note: "May 19 · 09:30 CET", done: true },
  { icon: Truck, title: "In transit", note: "May 20 · 14:12 CET", done: true, active: true },
  { icon: MapPin, title: "Delivered", note: "Expected May 22", done: false },
];

function Track() {
  const [id, setId] = useState("HV-10238");
  const [shown, setShown] = useState(true);
  return (
    <>
      <PageHero
        eyebrow="Tracking"
        title="Where is my order?"
        breadcrumb={[{ label: "Order tracking" }]}
      />
      <section className="mx-auto max-w-3xl px-6 py-16 md:px-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShown(true);
          }}
          className="flex flex-wrap gap-3 rounded-full border border-border p-2"
        >
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Order number (HV-XXXXX)"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none"
          />
          <LuxeButton>Track</LuxeButton>
        </form>

        {shown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 rounded-md border border-border bg-card p-8 soft-shadow"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-eyebrow text-muted-foreground">Order</p>
                <p className="mt-2 text-display text-3xl">{id}</p>
              </div>
              <p className="rounded-full bg-mustard/25 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-graphite">
                In transit
              </p>
            </div>

            <div className="mt-10 space-y-8">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.15 }}
                  className="flex gap-6"
                >
                  <div className="relative">
                    <div
                      className={`grid h-11 w-11 place-items-center rounded-full transition-all ${
                        s.done
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      } ${s.active ? "ring-4 ring-accent/30" : ""}`}
                    >
                      <s.icon className="h-4 w-4" strokeWidth={1.5} />
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`absolute left-1/2 top-11 h-16 w-px -translate-x-1/2 ${steps[i + 1].done ? "bg-primary" : "bg-border"}`}
                      />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-display text-lg">{s.title}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      {s.note}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </>
  );
}
