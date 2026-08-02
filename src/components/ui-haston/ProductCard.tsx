import { Link } from "@tanstack/react-router";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/haston-data";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [wished, setWished] = useState(false);
  const [color, setColor] = useState(0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
          {/* Badges */}
          <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1">
            {product.isNew && (
              <span className="rounded-full bg-primary px-2 py-[3px] text-[7px] uppercase tracking-[0.24em] text-primary-foreground">
                New
              </span>
            )}
            {product.isBestseller && (
              <span className="rounded-full bg-accent px-2 py-[3px] text-[7px] uppercase tracking-[0.24em] text-accent-foreground">
                Best
              </span>
            )}
            {product.compareAt && (
              <span className="rounded-full glass-panel px-2 py-[3px] text-[7px] uppercase tracking-[0.24em]">
                −{Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setWished((v) => !v);
            }}
            aria-label="Wishlist"
            className="absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full glass-panel opacity-0 transition-all duration-500 group-hover:opacity-100 hover:scale-110 active:scale-90"
          >
            <Heart
              className={`h-[13px] w-[13px] transition-all ${wished ? "fill-terracotta text-terracotta" : ""}`}
            />
          </button>

          {/* Images */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-hover:opacity-0"
          />
          <img
            src={product.hoverImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-0 transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-hover:opacity-100"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

          {/* Hover overlay actions */}
          <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="m-2 flex items-center gap-1.5 rounded-full glass-panel p-1">
              <button
                onClick={(e) => e.preventDefault()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-[8px] uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:scale-[0.98]"
              >
                <ShoppingBag className="h-[11px] w-[11px]" /> Add
              </button>
              <button
                onClick={(e) => e.preventDefault()}
                aria-label="Quick view"
                className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Eye className="h-[13px] w-[13px]" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[7.5px] uppercase tracking-[0.24em] text-muted-foreground">
              {product.category}
            </p>
            <h3 className="mt-1 truncate text-display text-[11px] leading-snug">{product.name}</h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[11px]">${product.price}</p>
            {product.compareAt && (
              <p className="text-[9px] text-muted-foreground line-through">${product.compareAt}</p>
            )}
          </div>
        </div>

        {/* Color swatches */}
        <div className="mt-2 flex items-center gap-1">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              onClick={(e) => {
                e.preventDefault();
                setColor(i);
              }}
              aria-label={c.name}
              className={`h-3 w-3 rounded-full ring-1 ring-inset ring-black/10 transition-all ${
                color === i ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </Link>
    </motion.article>
  );
}
