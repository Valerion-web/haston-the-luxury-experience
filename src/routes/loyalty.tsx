import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/loyalty")({
  head: () => ({
    meta: [
      { title: "HASTON Privilege — HASTON" },
      { name: "description", content: "The HASTON Privilege loyalty programme." },
    ],
  }),
  component: Loyalty,
});

const tiers = [
  {
    name: "Silver",
    mark: "01",
    threshold: "Join the house",
    tone: "bg-secondary",
    benefits: [
      "Early access to new edits",
      "Complimentary standard delivery",
      "Birthday atelier note",
    ],
  },
  {
    name: "Gold",
    mark: "02",
    threshold: "₹50,000 annual spend",
    tone: "bg-mustard/20",
    benefits: [
      "Private previews before release",
      "Complimentary express delivery",
      "Priority alterations and fittings",
    ],
  },
  {
    name: "Platinum",
    mark: "03",
    threshold: "₹1,50,000 annual spend",
    tone: "bg-primary text-primary-foreground",
    benefits: [
      "Personal stylist access",
      "White-glove delivery worldwide",
      "Made-to-measure appointment",
    ],
  },
];

function Loyalty() {
  return (
    <>
      <PageHero
        eyebrow="HASTON Privilege"
        title="Belong to the house."
        description="A considered way to be rewarded for choosing fewer, better pieces."
        breadcrumb={[{ label: "Privilege" }]}
      />
      <section className="mx-auto max-w-[1600px] px-6 py-12 md:px-10">
        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.article
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-md border border-border p-7 soft-shadow ${tier.tone}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-eyebrow opacity-70">Privilege · {tier.mark}</p>
                  <h2 className="mt-5 text-display text-3xl">{tier.name}</h2>
                </div>
                <Crown className="h-5 w-5 text-accent" />
              </div>
              <p className="mt-3 text-xs opacity-70">{tier.threshold}</p>
              <ul className="mt-8 space-y-4 border-t border-current/15 pt-6">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
        <div className="mt-14 grid gap-8 border-t border-border pt-10 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-eyebrow text-muted-foreground">The atelier principle</p>
            <h2 className="mt-4 text-display text-3xl">Luxury, made personal.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Every Privilege tier is an invitation to spend more time with the pieces you own. Your
            benefits follow you from the online house to every HASTON fitting room.
          </p>
        </div>
        <div className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent" /> Benefits are illustrative and subject to
          programme terms.
        </div>
      </section>
    </>
  );
}
