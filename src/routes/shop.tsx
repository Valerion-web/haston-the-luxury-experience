import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";
import { ProductCard } from "@/components/ui-haston/ProductCard";
import { IMG } from "@/lib/haston-data";
import { useHastonProducts } from "@/hooks/use-haston-data";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — HASTON" },
      { name: "description", content: "Shop the complete HASTON collection." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { data: products = [], isLoading, error } = useHastonProducts();
  const catalog = Array.from(new Map(products.map((product) => [product.id, product])).values());

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="The complete HASTON collection."
        description="A considered wardrobe of refined essentials, made for everyday elegance."
        breadcrumb={[{ label: "Shop" }]}
        image={IMG.heroShop}
      />

      <section className="mx-auto max-w-[1600px] px-6 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-8 hairline">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {isLoading ? "Loading..." : `${catalog.length} pieces`}
          </p>
        </div>

        {error ? (
          <p role="alert" className="py-10 text-center text-sm text-destructive">
            Unable to load the collection.
          </p>
        ) : isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading the collection...
          </p>
        ) : catalog.length === 0 ? (
          <p className="py-10 text-center text-display text-2xl">No pieces are available.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {catalog.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
