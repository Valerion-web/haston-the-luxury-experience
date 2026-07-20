import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/haston-data";

const navLinks = [
  { label: "New", to: "/collections/new-arrivals" },
  { label: "Shop", to: "/collections", mega: true },
  { label: "Lookbook", to: "/lookbook" },
  { label: "Journal", to: "/journal" },
  { label: "About", to: "/about" },
  { label: "Stores", to: "/store-locator" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverMega, setHoverMega] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "glass-panel py-3 soft-shadow" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-[auto_1fr_auto] items-center gap-6 px-6 md:px-10">
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <div
                key={l.label}
                onMouseEnter={() => l.mega && setHoverMega(true)}
                onMouseLeave={() => l.mega && setHoverMega(false)}
              >
                <Link
                  to={l.to}
                  className="group relative text-[11px] uppercase tracking-[0.28em] transition-colors"
                >
                  <span>{l.label}</span>
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </Link>
              </div>
            ))}
          </nav>
        </div>

        <Link to="/" className="flex flex-col items-center leading-none">
          <span className="text-display text-2xl tracking-[0.3em] md:text-3xl">HASTON</span>
          <span className="mt-1 text-[9px] uppercase tracking-[0.4em] text-muted-foreground">
            by House of Valerion
          </span>
        </Link>

        <div className="flex items-center justify-end gap-3 md:gap-5">
          <button aria-label="Search" className="hover:opacity-70">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="hover:opacity-70">
            <Heart className="h-[18px] w-[18px]" />
          </Link>
          <Link to="/account" aria-label="Account" className="hidden hover:opacity-70 md:block">
            <User className="h-[18px] w-[18px]" />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative hover:opacity-70">
            <ShoppingBag className="h-[18px] w-[18px]" />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] text-accent-foreground">
              2
            </span>
          </Link>
        </div>
      </div>

      {/* Mega menu */}
      <AnimatePresence>
        {hoverMega && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHoverMega(true)}
            onMouseLeave={() => setHoverMega(false)}
            className="absolute left-0 right-0 top-full hidden border-t border-border/50 glass-panel lg:block"
          >
            <div className="mx-auto grid max-w-[1600px] grid-cols-4 gap-8 px-10 py-12">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  className="group relative overflow-hidden rounded-md"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-display text-lg">{c.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      {c.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-background p-8 lg:hidden"
          >
            <div className="mb-10 flex items-center justify-between">
              <span className="text-display text-xl tracking-[0.3em]">HASTON</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-display text-3xl"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-8 hairline pt-8 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                <Link to="/account" onClick={() => setMenuOpen(false)} className="block py-2">
                  Account
                </Link>
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block py-2">
                  Wishlist
                </Link>
                <Link to="/support" onClick={() => setMenuOpen(false)} className="block py-2">
                  Support
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
