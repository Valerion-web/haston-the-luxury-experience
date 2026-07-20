import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getProduct, PRODUCTS } from "@/lib/haston-data";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck, ChevronDown, Star, Minus, Plus } from "lucide-react";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { ProductCard } from "@/components/ui-haston/ProductCard";
import { SectionHeader } from "@/components/ui-haston/SectionHeader";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const p = PRODUCTS.find(x => x.slug === params.slug);
    return {
      meta: [
        { title: p ? `${p.name} — HASTON` : "Product — HASTON" },
        { name: "description", content: p?.description || "HASTON product." },
        p ? { property: "og:image", content: p.image } : { property: "og:image", content: "" },
      ].filter(m => m.content !== ""),
    };
  },
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: PDP,
});

function PDP() {
  const { product } = Route.useLoaderData();
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [open, setOpen] = useState<string | null>("details");

  const gallery = [product.image, product.hoverImage, product.image, product.hoverImage];
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-6 py-10 md:px-10 md:py-16">
        <nav className="mb-8 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/collections">Collections</Link><span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_460px] md:gap-16">
          {/* Gallery */}
          <div className="flex gap-4">
            <div className="hidden w-20 shrink-0 flex-col gap-3 md:flex">
              {gallery.map((src, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`overflow-hidden rounded-md border-2 transition-all ${imgIdx === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={src} alt="" className="aspect-[4/5] w-full object-cover" />
                </button>
              ))}
            </div>
            <motion.div
              key={imgIdx}
              initial={{ opacity: 0.4, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex-1 overflow-hidden rounded-md bg-muted luxe-shadow"
            >
              <img src={gallery[imgIdx]} alt={product.name} className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.isNew && <span className="rounded-full bg-primary px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-primary-foreground">New</span>}
                {product.isBestseller && <span className="rounded-full bg-accent px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-accent-foreground">Bestseller</span>}
              </div>
            </motion.div>
          </div>

          {/* Sticky purchase panel */}
          <div className="md:sticky md:top-32 md:self-start">
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{product.category}</p>
            <h1 className="mt-3 text-display text-4xl leading-[1.05] md:text-5xl">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-mustard text-mustard" : "text-border"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{product.rating} · {product.reviews} reviews</span>
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-2xl font-medium">${product.price}</span>
              {product.compareAt && <span className="text-base text-muted-foreground line-through">${product.compareAt}</span>}
            </div>

            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-10">
              <p className="text-eyebrow">Color · <span className="normal-case tracking-normal text-foreground">{product.colors[color].name}</span></p>
              <div className="mt-4 flex gap-3">
                {product.colors.map((c: { name: string; hex: string }, i: number) => (
                  <button key={c.name} onClick={() => setColor(i)} aria-label={c.name}
                    className={`h-10 w-10 rounded-full ring-1 ring-black/10 transition-all ${color === i ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    style={{ backgroundColor: c.hex }} />
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className="text-eyebrow">Size</p>
                <button className="text-[10px] uppercase tracking-[0.28em] underline">Size guide</button>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-5">
                {product.sizes.map((s: string) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`rounded border py-3 text-xs uppercase tracking-[0.24em] transition-all ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-full border border-border p-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><Minus className="h-3.5 w-3.5" /></button>
                <span className="w-8 text-center text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              <button onClick={() => setWished(v => !v)} aria-label="Wishlist"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border transition-all hover:scale-105">
                <Heart className={`h-4 w-4 ${wished ? "fill-terracotta text-terracotta" : ""}`} />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <LuxeButton variant="solid" className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4 inline" /> Add to bag — ${product.price * qty}
              </LuxeButton>
              <LuxeButton variant="outline" className="w-full">Buy it now</LuxeButton>
            </div>

            <div className="mt-8 space-y-3 hairline pt-6 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              <div className="flex items-center gap-3"><Truck className="h-4 w-4" strokeWidth={1.4}/> Free worldwide shipping over $180</div>
              <div className="flex items-center gap-3"><RefreshCw className="h-4 w-4" strokeWidth={1.4}/> 30-day returns, free & effortless</div>
              <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4" strokeWidth={1.4}/> Lifetime alterations in every store</div>
            </div>

            <div className="mt-10 border-t border-border">
              {[
                { id: "details", title: "Fabric & details", body: "Woven in a single European mill from GOTS-certified fibers. Mother-of-pearl buttons, French seams, and a soft-collar roll finished by hand." },
                { id: "care", title: "Care", body: "Cold hand wash or dry clean. Air dry flat, iron on low. Store folded to preserve shape." },
                { id: "shipping", title: "Shipping & returns", body: "Complimentary worldwide shipping on orders over $180. Free 30-day returns, no questions asked." },
                { id: "reviews", title: `Reviews (${product.reviews})`, body: "\"The fit is impeccable — I bought a second in navy the week after.\" — Marco, Milano" },
              ].map(row => (
                <div key={row.id} className="border-b border-border">
                  <button onClick={() => setOpen(open === row.id ? null : row.id)} className="flex w-full items-center justify-between py-4 text-left text-[11px] uppercase tracking-[0.28em]">
                    {row.title}
                    <ChevronDown className={`h-4 w-4 transition-transform ${open === row.id ? "rotate-180" : ""}`} />
                  </button>
                  {open === row.id && (
                    <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      className="pb-6 text-sm leading-relaxed text-muted-foreground">{row.body}</motion.p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pb-24 md:px-10 md:pb-32">
        <SectionHeader eyebrow="Also loved" title="You may also like." />
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </>
  );
}
