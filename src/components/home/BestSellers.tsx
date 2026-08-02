import { PRODUCTS } from "@/lib/haston-data";
import { ProductCard } from "@/components/ui-haston/ProductCard";
import { SectionHeader } from "@/components/ui-haston/SectionHeader";

function dedupe<T extends { id: string }>(list: T[]) {
  return list.filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);
}

export function BestSellers() {
  const items = dedupe(
    PRODUCTS.filter((p) => p.isBestseller).concat(PRODUCTS.filter((p) => !p.isBestseller))
  ).slice(0, 12);
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-14 md:px-10 md:py-10">
      <SectionHeader
        eyebrow="Best sellers"
        title="Loved. Reordered. Rewarded."
        description="The pieces our clients return to, season after season."
        link={{ to: "/collections/bestsellers", label: "Shop all" }}
      />
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

export function NewArrivals() {
  const items = dedupe(PRODUCTS.filter((p) => p.isNew).concat(PRODUCTS)).slice(0, 12);
  return (
    <section className="bg-secondary/40">
      <div className="mx-auto max-w-[1600px] px-6 py-14 md:px-10 md:py-10">
        <SectionHeader
          eyebrow="Just arrived"
          title="New for the season."
          description="Fresh silhouettes, refined fabrics — first-look pieces from our autumn collection."
          link={{ to: "/collections/new-arrivals", label: "Discover new" }}
        />
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
