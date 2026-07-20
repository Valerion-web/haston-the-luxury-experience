import { Link } from "@tanstack/react-router";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/haston-data";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [wished, setWished] = useState(false);
  const [color, setColor] = useState(0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
          {/* Badges */}
          <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-primary px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-primary-foreground">
                New
              </span>
            )}
            {product.isBestseller && (
              <span className="rounded-full bg-accent px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-accent-foreground">
                Bestseller
              </span>
            )}
            {product.compareAt && (
              <span className="rounded-full glass-panel px-3 py-1 text-[9px] uppercase tracking-[0.28em]">
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
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full glass-panel transition-transform hover:scale-110 active:scale-90"
          >
            <Heart
              className={`h-4 w-4 transition-all ${wished ? "fill-terracotta text-terracotta" : ""}`}
            />
          </button>

          {/* Images */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] group-hover:scale-[1.06] group-hover:opacity-0"
          />
          <img
            src={product.hoverImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-[1.03] object-cover opacity-0 transition-all duration-[1200ms] group-hover:scale-[1.06] group-hover:opacity-100"
          />

          {/* Hover overlay actions */}
          <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="m-3 flex items-center gap-2 rounded-full glass-panel p-1.5">
              <button
                onClick={(e) => e.preventDefault()}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-[10px] uppercase tracking-[0.28em] text-primary-foreground transition-transform hover:scale-[0.98]"
              >
                <ShoppingBag className="h-3 w-3" /> Quick add
              </button>
              <button
                onClick={(e) => e.preventDefault()}
                aria-label="Quick view"
                className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {product.category}
            </p>
            <h3 className="mt-1.5 truncate text-display text-lg">{product.name}</h3>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.round(product.rating) ? "fill-mustard text-mustard" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">({product.reviews})</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">${product.price}</p>
            {product.compareAt && (
              <p className="text-[11px] text-muted-foreground line-through">${product.compareAt}</p>
            )}
          </div>
        </div>

        {/* Color swatches */}
        <div className="mt-3 flex items-center gap-1.5">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              onClick={(e) => {
                e.preventDefault();
                setColor(i);
              }}
              aria-label={c.name}
              className={`h-4 w-4 rounded-full ring-1 ring-inset ring-black/10 transition-all ${
                color === i ? "ring-2 ring-offset-2 ring-offset-background ring-primary" : ""
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </Link>
    </motion.article>
  );
}
