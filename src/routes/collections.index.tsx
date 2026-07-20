import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/haston-data";
import { PageHero } from "@/components/ui-haston/PageHero";
import { CategoryCard } from "@/components/ui-haston/CategoryCard";
import { motion } from "framer-motion";
import { IMG } from "@/lib/haston-data";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — HASTON" },
      {
        name: "description",
        content:
          "Explore every HASTON collection — knitwear, shirts, trousers, outerwear and seasonal edits.",
      },
    ],
  }),
  component: CollectionsIndex,
});

const editorial = [
  { slug: "new-arrivals", name: "New Arrivals", tagline: "Just landed", image: IMG.lb2 },
  { slug: "bestsellers", name: "Best Sellers", tagline: "House favorites", image: IMG.hero },
  {
    slug: "autumn-vol-07",
    name: "Autumn Vol. 07",
    tagline: "The seasonal edit",
    image: IMG.collectionBanner,
  },
];

function CollectionsIndex() {
  return (
    <>
      <PageHero
        eyebrow="Collections"
        title="Every piece, considered."
        description="Browse the full HASTON archive — from wardrobe essentials to seasonal edits."
        breadcrumb={[{ label: "Collections" }]}
      />
      <section className="mx-auto max-w-[1600px] px-6 py-20 md:px-10">
        <h2 className="text-eyebrow text-muted-foreground">Seasonal edits</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {editorial.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <Link
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="group relative block overflow-hidden rounded-md luxe-shadow"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-8 text-primary-foreground">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] opacity-80">
                      {c.tagline}
                    </p>
                    <p className="mt-2 text-display text-3xl">{c.name}</p>
                  </div>
                  <ArrowUpRight className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <h2 className="mt-20 text-eyebrow text-muted-foreground">Shop by category</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <CategoryCard key={c.slug} {...c} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
