import { CategoryCard } from "@/components/ui-haston/CategoryCard";
import { SectionHeader } from "@/components/ui-haston/SectionHeader";
import { IMG } from "@/lib/haston-data";
import { useHastonCategories } from "@/hooks/use-haston-data";

export function ShopByCategory() {
  const { data: categories = [], isLoading, error } = useHastonCategories();

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-9 md:px-10 md:py-10">
      <SectionHeader
        eyebrow="Shop by category"
        title="Wardrobe essentials, made deliberately."
        link={{ to: "/collections", label: "View all" }}
      />
      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading categories...</p>
      ) : error ? (
        <p role="alert" className="mt-8 text-sm text-destructive">Unable to load categories.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, i) => (
            <CategoryCard
              key={category.slug}
              slug={category.slug}
              name={category.name}
              tagline={category.description || "Explore the collection"}
              image={IMG.heroShop}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  );
}
