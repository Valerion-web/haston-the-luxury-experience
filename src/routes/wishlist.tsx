import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PRODUCTS } from "@/lib/haston-data";
import { PageHero } from "@/components/ui-haston/PageHero";
import { ProductCard } from "@/components/ui-haston/ProductCard";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — HASTON" }, { name: "description", content: "Your HASTON wishlist." }] }),
  component: Wishlist,
});

function Wishlist() {
  const [items] = useState(PRODUCTS.slice(0, 6));
  return (
    <>
      <PageHero eyebrow="Wishlist" title="Pieces you're considering."
        description="Save what you love — return to it when you're ready."
        breadcrumb={[{ label: "Wishlist" }]} />
      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-10">
        {items.length === 0 ? (
          <div className="grid place-items-center py-24 text-center">
            <Heart className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-4 text-display text-2xl">Nothing saved yet.</p>
            <LuxeButton to="/collections" className="mt-8" arrow>Explore collections</LuxeButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </>
  );
}
