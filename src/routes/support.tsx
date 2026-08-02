import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/ui-haston/PageHero";
import { ChevronDown, Truck, RefreshCw, Ruler, Shield, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — HASTON" },
      {
        name: "description",
        content: "HASTON customer support — shipping, returns, sizing & care.",
      },
    ],
  }),
  component: Support,
});

const topics = [
  { icon: Truck, title: "Shipping" },
  { icon: RefreshCw, title: "Returns" },
  { icon: Ruler, title: "Sizing" },
  { icon: Shield, title: "Care" },
  { icon: HelpCircle, title: "General" },
];

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Complimentary standard shipping arrives in 5–7 business days worldwide. Express is 2–3 days. White-glove is next-day in select cities.",
  },
  {
    q: "What is your return policy?",
    a: "Free 30-day returns from delivery date. Items must be unworn, with original tags. Initiate a return in your account or contact client service.",
  },
  {
    q: "Do you offer alterations?",
    a: "Yes — complimentary lifetime alterations in every HASTON store, worldwide. Book a fitting appointment at your local boutique.",
  },
  {
    q: "How do I find my size?",
    a: "Every product page includes a fabric-aware size guide. Our stylists can also help — reach us via chat or email.",
  },
  {
    q: "Are your fabrics traceable?",
    a: "Every fibre we buy is traceable to origin. We publish a list of our mills and workshops in the Journal.",
  },
  {
    q: "Do you ship internationally?",
    a: "We ship to 68 countries. Duties are calculated at checkout so nothing arrives unexpected.",
  },
];

function Support() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="How can we help?"
        description="Answers within 24 hours. Real humans, no scripts."
        breadcrumb={[{ label: "Support" }]}
      />
      <section className="mx-auto max-w-[1600px] px-6 py-10 md:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {topics.map((t) => (
            <motion.button
              key={t.title}
              whileHover={{ y: -4 }}
              className="rounded-md border border-border bg-card p-6 text-left soft-shadow"
            >
              <t.icon className="h-5 w-5 text-accent" strokeWidth={1.4} />
              <p className="mt-4 text-[11px] uppercase tracking-[0.28em]">{t.title}</p>
            </motion.button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <p className="text-eyebrow text-muted-foreground">Frequently asked</p>
          <div className="mt-6">
            {faqs.map((f, i) => (
              <div key={i} className="border-b border-border">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="text-display text-xl">{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                {open === i && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pb-6 text-sm leading-relaxed text-muted-foreground"
                  >
                    {f.a}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
