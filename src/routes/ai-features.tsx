import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Camera, Combine, MessageCircle, Ruler, Shirt } from "lucide-react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/ai-features")({
  head: () => ({
    meta: [
      { title: "The HASTON Atelier — HASTON" },
      { name: "description", content: "Explore the HASTON digital atelier." },
    ],
  }),
  component: AIFeatures,
});

const features = [
  {
    icon: Camera,
    title: "Virtual try-on",
    body: "See the silhouette in your world with a considered digital fitting.",
  },
  {
    icon: Ruler,
    title: "Size recommendation",
    body: "A fabric-aware fit guide shaped around how you like to wear a piece.",
  },
  {
    icon: MessageCircle,
    title: "Style assistant",
    body: "A quiet conversation about colour, occasion and what you already own.",
  },
  {
    icon: Combine,
    title: "Mix & match",
    body: "Build a complete wardrobe from the pieces that speak to each other.",
  },
  {
    icon: Shirt,
    title: "Your wardrobe",
    body: "Keep a private edit of favourites, measurements and considered looks.",
  },
];

function AIFeatures() {
  return (
    <>
      <PageHero
        eyebrow="The digital atelier"
        title="A little more considered."
        description="Tools that help you choose well, wear often and keep what matters."
        breadcrumb={[{ label: "The Atelier" }]}
      />
      <section className="mx-auto max-w-[1600px] px-6 py-12 md:px-10">
        <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.08 }}
              className="bg-background p-8 md:min-h-64"
            >
              <feature.icon className="h-5 w-5 text-accent" strokeWidth={1.4} />
              <h2 className="mt-12 text-display text-2xl">{feature.title}</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                {feature.body}
              </p>
              <Link
                to="/support"
                className="mt-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em]"
              >
                Explore with a stylist <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
