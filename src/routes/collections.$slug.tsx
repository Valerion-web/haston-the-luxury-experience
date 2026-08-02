import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PRODUCTS, CATEGORIES, productsByCategory } from "@/lib/haston-data";
import { PageHero } from "@/components/ui-haston/PageHero";
import { ProductCard } from "@/components/ui-haston/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/collections/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — HASTON` },
      {
        name: "description",
        content: `Shop the ${params.slug.replace(/-/g, " ")} collection from HASTON.`,
      },
    ],
  }),
  component: CollectionPage,
});

const ALL_COLORS = [
  { name: "Navy", hex: "#0E1A2B" },
  { name: "Ivory", hex: "#F6F3E0" },
  { name: "Sand", hex: "#D8C8B2" },
  { name: "Graphite", hex: "#222222" },
  { name: "Olive", hex: "#55684E" },
  { name: "Terracotta", hex: "#B4553E" },
  { name: "Denim", hex: "#4A6B8A" },
  { name: "Forest", hex: "#2F4A32" },
];
const ALL_SIZES = ["S", "M", "L", "XL", "28", "30", "32", "34", "36"];
const SORTS = [
  "Featured",
  "New arrivals",
  "Price: Low to high",
  "Price: High to low",
  "Best rated",
];

function CollectionPage() {
  const { slug } = Route.useParams();
  const [open, setOpen] = useState(false);
  const [priceMax, setPriceMax] = useState(400);
  const [selColors, setSelColors] = useState<string[]>([]);
  const [selSizes, setSelSizes] = useState<string[]>([]);
  const [sort, setSort] = useState(SORTS[0]);
  const [sortOpen, setSortOpen] = useState(false);

  const cat = CATEGORIES.find((c) => c.slug === slug);
  const title = cat?.name || slug.replace(/-/g, " ");

  const base = useMemo(() => {
    if (slug === "new-arrivals") return PRODUCTS.filter((p) => p.isNew).concat(PRODUCTS);
    if (slug === "bestsellers") return PRODUCTS.filter((p) => p.isBestseller).concat(PRODUCTS);
    if (cat) return productsByCategory(slug);
    return PRODUCTS;
  }, [slug, cat]);

  const products = useMemo(() => {
    let list = base.filter((p) => p.price <= priceMax);
    if (selColors.length)
      list = list.filter((p) => p.colors.some((c) => selColors.includes(c.name)));
    if (selSizes.length) list = list.filter((p) => p.sizes.some((s) => selSizes.includes(s)));
    switch (sort) {
      case "Price: Low to high":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "Price: High to low":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "Best rated":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "New arrivals":
        list = [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
        break;
    }
    // dedupe
    return Array.from(new Map(list.map((p) => [p.id, p])).values());
  }, [base, priceMax, selColors, selSizes, sort]);

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <>
      <PageHero
        eyebrow="Collection"
        title={title}
        description={cat?.tagline || "A considered edit from the HASTON archive."}
        breadcrumb={[{ label: "Collections", to: "/collections" }, { label: title }]}
      />

      <section className="mx-auto max-w-[1600px] px-6 py-12 md:px-10">
        <div className="flex items-center justify-between gap-4 pb-8 hairline">
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[11px] uppercase tracking-[0.28em] transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            {products.length} pieces
          </p>
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[11px] uppercase tracking-[0.28em]"
            >
              {sort} <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 top-full z-20 mt-2 w-64 rounded-md border border-border bg-popover p-2 soft-shadow"
                >
                  {SORTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSort(s);
                        setSortOpen(false);
                      }}
                      className={`block w-full rounded px-4 py-2.5 text-left text-xs uppercase tracking-[0.24em] transition-colors hover:bg-muted ${sort === s ? "bg-muted" : ""}`}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <AnimatePresence initial={false}>
            {open && (
              <motion.aside
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="hidden overflow-hidden lg:block"
              >
                <FilterPanel
                  {...{
                    priceMax,
                    setPriceMax,
                    selColors,
                    selSizes,
                    toggle,
                    setSelColors,
                    setSelSizes,
                  }}
                />
              </motion.aside>
            )}
          </AnimatePresence>

          <div className={open ? "lg:col-start-2" : "lg:col-span-2"}>
            {products.length === 0 ? (
              <div className="grid place-items-center py-10 text-center">
                <p className="text-display text-2xl">No pieces match these filters.</p>
                <button
                  onClick={() => {
                    setSelColors([]);
                    setSelSizes([]);
                    setPriceMax(400);
                  }}
                  className="mt-6 text-[11px] uppercase tracking-[0.28em] underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-[86%] max-w-sm overflow-y-auto bg-background p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="text-eyebrow">Filters</p>
                <button onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterPanel
                {...{
                  priceMax,
                  setPriceMax,
                  selColors,
                  selSizes,
                  toggle,
                  setSelColors,
                  setSelSizes,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface FilterPanelProps {
  priceMax: number;
  setPriceMax: (v: number) => void;
  selColors: string[];
  selSizes: string[];
  toggle: (arr: string[], v: string, set: (a: string[]) => void) => void;
  setSelColors: (v: string[]) => void;
  setSelSizes: (v: string[]) => void;
}

function FilterPanel(p: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-eyebrow">Price</p>
        <input
          type="range"
          min={50}
          max={400}
          value={p.priceMax}
          onChange={(e) => p.setPriceMax(+e.target.value)}
          className="mt-6 w-full accent-primary"
        />
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>$50</span>
          <span>Up to ${p.priceMax}</span>
        </div>
      </div>
      <div>
        <p className="text-eyebrow">Color</p>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {ALL_COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => p.toggle(p.selColors, c.name, p.setSelColors)}
              aria-label={c.name}
              className={`h-8 w-8 rounded-full ring-1 ring-black/10 transition-all ${p.selColors.includes(c.name) ? "ring-2 ring-offset-2 ring-primary" : ""}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-eyebrow">Size</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => p.toggle(p.selSizes, s, p.setSelSizes)}
              className={`min-w-11 rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.24em] transition-colors ${p.selSizes.includes(s) ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
