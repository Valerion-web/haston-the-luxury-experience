import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PRODUCTS, inr } from "@/lib/haston-data";
import { PageHero } from "@/components/ui-haston/PageHero";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { X, Plus, Minus, ShieldCheck, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ui-haston/ProductCard";
import { SectionHeader } from "@/components/ui-haston/SectionHeader";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Cart — HASTON" }, { name: "description", content: "Your HASTON bag." }],
  }),
  component: Cart,
});

type Line = { id: string; qty: number; size: string; color: string };

function Cart() {
  const [lines, setLines] = useState<Line[]>([
    { id: "1", qty: 1, size: "M", color: "Navy" },
    { id: "3", qty: 2, size: "L", color: "Olive" },
  ]);
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);

  const items = lines.map((l) => ({ ...l, product: PRODUCTS.find((p) => p.id === l.id)! }));
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 180 ? 0 : 12;
  const total = subtotal - discount + shipping;

  return (
    <>
      <PageHero eyebrow="Your bag" title="The bag" breadcrumb={[{ label: "Cart" }]} />
      <section className="mx-auto max-w-[1600px] px-6 py-10 md:px-10">
        {items.length === 0 ? (
          <div className="grid place-items-center py-9 text-center">
            <p className="text-display text-3xl">Your bag is empty.</p>
            <LuxeButton to="/collections" className="mt-8" arrow>
              Continue shopping
            </LuxeButton>
          </div>
        ) : (
          <div className="grid gap-7 lg:grid-cols-[1fr_420px]">
            <div>
              <div className="hairline pb-4 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                <div className="grid grid-cols-[100px_1fr_auto] gap-4 md:grid-cols-[120px_1fr_120px_80px]">
                  <span>Item</span>
                  <span></span>
                  <span className="hidden text-center md:inline">Quantity</span>
                  <span className="hidden text-right md:inline">Price</span>
                </div>
              </div>
              <AnimatePresence initial={false}>
                {items.map(({ product, qty, size, color, id }) => (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="grid grid-cols-[100px_1fr_auto] items-center gap-4 border-b border-border py-6 md:grid-cols-[120px_1fr_120px_80px]"
                  >
                    <Link
                      to="/product/$slug"
                      params={{ slug: product.slug }}
                      className="block overflow-hidden rounded"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="aspect-[4/5] w-full object-cover"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        to="/product/$slug"
                        params={{ slug: product.slug }}
                        className="text-display text-lg"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                        {color} · Size {size}
                      </p>
                      <button
                        onClick={() => setLines((ls) => ls.filter((l) => l.id !== id))}
                        className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </div>
                    <div className="flex items-center gap-1 justify-self-center rounded-full border border-border p-1">
                      <button
                        onClick={() =>
                          setLines((ls) =>
                            ls.map((l) =>
                              l.id === id ? { ...l, qty: Math.max(1, l.qty - 1) } : l,
                            ),
                          )
                        }
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center text-sm">{qty}</span>
                      <button
                        onClick={() =>
                          setLines((ls) =>
                            ls.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)),
                          )
                        }
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-right text-sm font-medium">{inr(product.price * qty)}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <aside className="md:sticky md:top-32 md:self-start">
              <div className="rounded-md border border-border bg-card p-8 soft-shadow">
                <p className="text-eyebrow">Order summary</p>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{inr(subtotal)}</span>
                  </div>
                  {applied && (
                    <div className="flex justify-between text-accent">
                      <span>Discount (WELCOME10)</span>
                      <span>-{inr(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Complimentary" : inr(shipping)}</span>
                  </div>
                </div>
                <div className="mt-6 hairline pt-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-display">Total</span>
                    <span className="font-medium">{inr(total)}</span>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (promo) setApplied(true);
                  }}
                  className="mt-6 flex items-center gap-2 rounded-full border border-border p-1.5"
                >
                  <Tag className="ml-3 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Promo code"
                    className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none"
                  />
                  <button className="rounded-full bg-primary px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-primary-foreground">
                    Apply
                  </button>
                </form>

                <LuxeButton to="/checkout" className="mt-6 w-full" arrow>
                  Checkout securely
                </LuxeButton>

                <p className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" /> Secure encrypted checkout
                </p>
              </div>
            </aside>
          </div>
        )}

        <div className="mt-6">
          <SectionHeader eyebrow="Complete the look" title="You may also like." />
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
