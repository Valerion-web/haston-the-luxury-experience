import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PRODUCTS } from "@/lib/haston-data";
import { PageHero } from "@/components/ui-haston/PageHero";
import { ProductCard } from "@/components/ui-haston/ProductCard";
import { Search } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — HASTON" },
      { name: "description", content: "Search the HASTON collection." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("linen");
  const results = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return PRODUCTS;
    return PRODUCTS.filter((p) =>
      (p.name + " " + p.category + " " + p.description).toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <>
      <PageHero eyebrow="Search" title="Find your piece." breadcrumb={[{ label: "Search" }]}>
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3 soft-shadow">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, fabrics, categories…"
            className="flex-1 bg-transparent text-base focus:outline-none"
          />
        </div>
      </PageHero>
      <section className="mx-auto max-w-[1600px] px-6 py-10 md:px-10">
        <p className="mb-6 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          {results.length} results for "{q}"
        </p>
        {results.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <p className="py-9 text-center text-display text-2xl">No pieces match your search.</p>
        )}
      </section>
    </>
  );
}
