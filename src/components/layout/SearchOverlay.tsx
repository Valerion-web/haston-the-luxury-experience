import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PRODUCTS, CATEGORIES } from "@/lib/haston-data";

const POPULAR = ["Linen Shirt", "Overshirt", "Cashmere", "Chinos", "Polo", "Merino"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem("haston_recent") || "[]");
      if (Array.isArray(r)) setRecent(r.slice(0, 6));
    } catch {}
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return { products: [], cats: [] };
    return {
      products: PRODUCTS.filter((p) =>
        (p.name + " " + p.category + " " + p.description).toLowerCase().includes(s),
      ).slice(0, 5),
      cats: CATEGORIES.filter((c) => c.name.toLowerCase().includes(s)).slice(0, 4),
    };
  }, [q]);

  const commit = (term: string) => {
    if (!term.trim()) return;
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
    setRecent(next);
    try {
      localStorage.setItem("haston_recent", JSON.stringify(next));
    } catch {}
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80]"
        >
          <div className="absolute inset-0 bg-primary/70 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-w-[1100px] px-6 pt-16 md:pt-24"
          >
            <div className="glass-panel overflow-hidden rounded-2xl soft-shadow">
              <div className="flex items-center gap-4 border-b border-border/50 px-6 py-5">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commit(q)}
                  placeholder="Search products, fabrics, categories…"
                  className="flex-1 bg-transparent text-lg focus:outline-none"
                />
                <button onClick={onClose} aria-label="Close" className="opacity-60 hover:opacity-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-[1fr_1.4fr]">
                <div className="space-y-8">
                  {recent.length > 0 && (
                    <div>
                      <p className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                        <Clock className="h-3 w-3" /> Recent
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => setQ(r)}
                            className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-primary hover:text-primary-foreground"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      <TrendingUp className="h-3 w-3" /> Popular
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((p) => (
                        <button
                          key={p}
                          onClick={() => setQ(p)}
                          className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-primary hover:text-primary-foreground"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  {results.cats.length > 0 && (
                    <div>
                      <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                        Categories
                      </p>
                      <ul className="space-y-2">
                        {results.cats.map((c) => (
                          <li key={c.slug}>
                            <Link
                              to="/collections/$slug"
                              params={{ slug: c.slug }}
                              onClick={() => {
                                commit(c.name);
                                onClose();
                              }}
                              className="text-sm hover:underline"
                            >
                              {c.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    {q ? "Product suggestions" : "Featured"}
                  </p>
                  <ul className="space-y-3">
                    {(results.products.length ? results.products : PRODUCTS.slice(0, 4)).map((p) => (
                      <li key={p.id}>
                        <Link
                          to="/product/$slug"
                          params={{ slug: p.slug }}
                          onClick={() => {
                            commit(p.name);
                            onClose();
                          }}
                          className="group flex items-center gap-4 rounded-md p-2 transition-colors hover:bg-muted/60"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-16 w-14 rounded-sm object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-display text-base">{p.name}</p>
                            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                              {p.category}
                            </p>
                          </div>
                          <p className="text-sm font-medium">₹{(p.price * 85).toLocaleString("en-IN")}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
