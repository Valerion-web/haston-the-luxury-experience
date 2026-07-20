import { CATEGORIES } from "@/lib/haston-data";
import { CategoryCard } from "@/components/ui-haston/CategoryCard";
import { SectionHeader } from "@/components/ui-haston/SectionHeader";

export function ShopByCategory() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
      <SectionHeader
        eyebrow="Shop by category"
        title="Wardrobe essentials, made deliberately."
        link={{ to: "/collections", label: "View all" }}
      />
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c, i) => (
          <CategoryCard key={c.slug} {...c} index={i} />
        ))}
      </div>
    </section>
  );
}
