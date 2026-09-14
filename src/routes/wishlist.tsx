import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";
import { ProductCard } from "@/components/ui-haston/ProductCard";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { Heart } from "lucide-react";
import { useHastonSession } from "@/hooks/use-haston-session";
import { useHastonWishlist } from "@/hooks/use-haston-wishlist";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — HASTON" },
      { name: "description", content: "Your HASTON wishlist." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const session = useHastonSession();
  const { items, isLoading, error } = useHastonWishlist();
  const products = items.map((item) => item.product);
  return (
    <>
      <PageHero
        eyebrow="Wishlist"
        title="Pieces you're considering."
        description="Save what you love — return to it when you're ready."
        breadcrumb={[{ label: "Wishlist" }]}
      />
      <section className="mx-auto max-w-[1600px] px-6 py-10 md:px-10">
        {!session ? (
          <div className="grid place-items-center py-9 text-center">
            <Heart className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-4 text-display text-2xl">Sign in to view your wishlist.</p>
            <LuxeButton to="/login" className="mt-8" arrow>
              Sign in
            </LuxeButton>
          </div>
        ) : isLoading ? (
          <p className="py-9 text-center text-sm text-muted-foreground">Loading your wishlist...</p>
        ) : error ? (
          <p role="alert" className="py-9 text-center text-sm text-destructive">
            Unable to load your wishlist right now.
          </p>
        ) : products.length === 0 ? (
          <div className="grid place-items-center py-9 text-center">
            <Heart className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-4 text-display text-2xl">Nothing saved yet.</p>
            <LuxeButton to="/collections" className="mt-8" arrow>
              Explore collections
            </LuxeButton>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
