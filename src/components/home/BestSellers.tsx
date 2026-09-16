import { ProductCard } from "@/components/ui-haston/ProductCard";
import { SectionHeader } from "@/components/ui-haston/SectionHeader";
import { useHastonProducts } from "@/hooks/use-haston-data";

export function BestSellers() {
  const { data: products = [], isLoading, error } = useHastonProducts();
  const items = products.filter((product) => product.isBestseller).slice(0, 12);
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-9 md:px-10 md:py-10">
      <SectionHeader
        eyebrow="Best sellers"
        title="Loved. Reordered. Rewarded."
        description="The pieces our clients return to, season after season."
        link={{ to: "/collections/bestsellers", label: "Shop all" }}
      />
      {isLoading ? <p className="mt-8 text-sm text-muted-foreground">Loading best sellers...</p> : error ? <p role="alert" className="mt-8 text-sm text-destructive">Unable to load products.</p> : <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">{items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>}
    </section>
  );
}

export function NewArrivals() {
  const { data: products = [], isLoading, error } = useHastonProducts();
  const items = products.filter((product) => product.isNew).slice(0, 12);
  return (
    <section className="bg-secondary/40">
      <div className="mx-auto max-w-[1600px] px-6 py-9 md:px-10 md:py-10">
        <SectionHeader
          eyebrow="Just arrived"
          title="New for the season."
          description="Fresh silhouettes, refined fabrics — first-look pieces from our autumn collection."
          link={{ to: "/collections/new-arrivals", label: "Discover new" }}
        />
        {isLoading ? <p className="mt-8 text-sm text-muted-foreground">Loading new arrivals...</p> : error ? <p role="alert" className="mt-8 text-sm text-destructive">Unable to load products.</p> : <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">{items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>}
      </div>
    </section>
  );
}
