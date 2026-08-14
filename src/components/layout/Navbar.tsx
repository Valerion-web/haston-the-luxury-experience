import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/haston-data";
import { SearchOverlay } from "./SearchOverlay";
import logoFull from "@/assets/haston-logo-mark.png.asset.json";
import logoMark from "@/assets/haston-h.png.asset.json";

const navLinks = [
  { label: "New", to: "/collections/new-arrivals" },
  { label: "Shop", to: "/collections", mega: true },
  { label: "Lookbook", to: "/lookbook" },
  { label: "Journal", to: "/journal" },
  { label: "About", to: "/about" },
];

const MEGA_COLUMNS: { title: string; items: string[] }[] = [
  { title: "Tops", items: ["Shirts", "T-Shirts", "Polos", "Overshirts", "Knitwear"] },
  { title: "Bottoms", items: ["Trousers", "Chinos", "Jeans", "Cargo", "Shorts"] },
  { title: "Outerwear", items: ["Jackets", "Overshirts", "Coats", "Vests"] },
  { title: "Accessories", items: ["Belts", "Bags", "Caps", "Socks", "Scarves"] },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverMega, setHoverMega] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-border/60 bg-background/75 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_10px_40px_-18px_oklch(0.24_0.05_258/0.28)]"
          : "border-b border-border/40 bg-background/45 backdrop-blur-xl"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1600px] items-center gap-6 px-5 transition-all duration-500 md:px-8 ${
          scrolled ? "h-[56px] md:h-[60px]" : "h-[62px] md:h-[68px]"
        }`}
      >
        {/* Logo — left */}
        <div className="flex items-center gap-3">
          <button className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" strokeWidth={1.6} />
          </button>
          <Link to="/" className="flex items-center gap-2.5" aria-label="HASTON home">
            <img
              src={logoFull.url}
              alt="HASTON"
              width={1254}
              height={1254}
              className="h-10 w-auto object-contain md:h-12"
              loading="eager"
              decoding="async"
            />
          </Link>
        </div>

        {/* Nav — immediately after logo */}
        <nav className="hidden flex-1 items-center gap-7 lg:flex xl:gap-9">
          {navLinks.map((l) => {
            const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
            return (
              <div
                key={l.label}
                onMouseEnter={() => l.mega && setHoverMega(true)}
                onMouseLeave={() => l.mega && setHoverMega(false)}
              >
                <Link
                  to={l.to}
                  className={`group relative py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                    active ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <span>{l.label}</span>
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px w-full bg-sand transition-transform duration-500 ${
                      active
                        ? "scale-x-100"
                        : "origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </div>
            );
          })}
        </nav>


        {/* Icons — right */}
        <div className="ml-auto flex items-center gap-4 md:gap-5">
          <button aria-label="Search" onClick={() => setSearchOpen(true)} className="hover:opacity-60">
            <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="hover:opacity-60">
            <Heart className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </Link>
          <Link to="/account" aria-label="Account" className="hidden hover:opacity-60 md:block">
            <User className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative hover:opacity-60">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
            <span className="absolute -right-2 -top-2 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-accent text-[8px] text-accent-foreground">
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
            className="absolute left-0 right-0 top-full hidden border-t border-border/50 bg-background/85 backdrop-blur-xl lg:block"
          >
            <div className="mx-auto grid max-w-[1600px] grid-cols-[1.2fr_2fr] gap-8 px-8 py-8">
              <div className="grid grid-cols-4 gap-5">
                {MEGA_COLUMNS.map((col) => (
                  <div key={col.title}>
                    <p className="mb-3 text-[8px] uppercase tracking-[0.22em] text-gold">
                      {col.title}
                    </p>
                    <ul className="space-y-2">
                      {col.items.map((it) => (
                        <li key={it}>
                          <Link
                            to="/collections"
                            className="text-[10px] text-foreground/70 transition-colors hover:text-foreground"
                          >
                            {it}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    to="/collections/$slug"
                    params={{ slug: c.slug }}
                    className="group relative overflow-hidden rounded-sm"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.08]"
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-display text-[10px]">{c.name}</p>
                      <p className="text-[7.5px] uppercase tracking-[0.2em] text-muted-foreground">
                        {c.tagline}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
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
            className="fixed inset-0 z-[60] bg-background p-6 lg:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <img src={logoFull.url} alt="HASTON" className="h-10 w-auto object-contain" />
              <button onClick={() => setMenuOpen(false)} aria-label="Close">
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-display text-base uppercase tracking-[0.14em]"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-6 hairline pt-6 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                <Link to="/account" onClick={() => setMenuOpen(false)} className="block py-1.5">
                  Account
                </Link>
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block py-1.5">
                  Wishlist
                </Link>
                <Link to="/order-tracking" onClick={() => setMenuOpen(false)} className="block py-1.5">
                  Track Order
                </Link>
                <Link to="/support" onClick={() => setMenuOpen(false)} className="block py-1.5">
                  Support
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
