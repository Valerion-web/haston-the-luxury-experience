import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
  ArrowUpRight,
  Headphones,
  PackageSearch,
} from "lucide-react";
import { resolveBackendAssetUrl } from "@/lib/api-client";
import { IMG } from "@/lib/haston-data";
import { SearchOverlay } from "./SearchOverlay";
import logoFull from "@/assets/haston-logo.png";
import { useHastonSession } from "@/hooks/use-haston-session";
import { useHastonCart } from "@/hooks/use-haston-cart";
import { useHastonCategories } from "@/hooks/use-haston-data";

const navLinks = [
  { label: "New", to: "/collections/new-arrivals" },
  { label: "Shop", to: "/shop", mega: true },
  { label: "Lookbook", to: "/lookbook" },
  { label: "Journal", to: "/journal" },
  { label: "About", to: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverMega, setHoverMega] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const session = useHastonSession();
  const { items: cartItems } = useHastonCart();
  const { data: categories = [] } = useHastonCategories();
  const megaColumns = categories
    .filter((category) => category.parentId === null)
    .map((category) => ({
      category,
      children: categories.filter((child) => child.parentId === category.id),
    }))
    .filter((column) => column.children.length > 0);
  const megaCardCategories = categories.filter(
    (category) =>
      category.parentId === null &&
      categories.some((child) => child.parentId === category.id),
  );

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
              src={logoFull}
              alt="HASTON"
              width={342}
              height={320}
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
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="hover:opacity-60"
          >
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
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
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
                {megaColumns.map(({ category, children }) => (
                  <div key={category.id}>
                    <p className="mb-3 text-[8px] uppercase tracking-[0.22em] text-gold">
                      {category.name}
                    </p>
                    <ul className="space-y-2">
                      {children.map((child) => (
                        <li key={child.id}>
                          <Link
                            to="/collections/$slug"
                            params={{ slug: child.slug }}
                            className="text-[10px] text-foreground/70 transition-colors hover:text-foreground"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {megaCardCategories.map((c) => (
                  <Link
                    key={c.slug}
                    to="/collections/$slug"
                    params={{ slug: c.slug }}
                    className="group relative overflow-hidden rounded-sm"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={resolveBackendAssetUrl(c.image) || IMG.heroShop}
                        alt={c.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.08]"
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-display text-[10px]">{c.name}</p>
                      <p className="text-[7.5px] uppercase tracking-[0.2em] text-muted-foreground">
                        {c.description || "Explore the collection"}
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
            className="fixed left-0 top-0 z-[100] isolate flex h-dvh w-screen flex-col overflow-hidden bg-[#F8FAFC] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] text-[#0A1931] shadow-[12px_0_40px_-18px_rgba(10,25,49,0.35)] sm:px-6 lg:hidden"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#0A1931]/10 pb-4">
              <img src={logoFull} alt="HASTON" className="h-9 w-auto object-contain sm:h-10" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid size-[48px] place-items-center rounded-full border border-[#0A1931]/15 text-[#0A1931] transition-colors hover:border-[#D4AF37]/60 hover:bg-[#0A1931]/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-5">
              <p className="px-4 pb-2 text-[9px] uppercase tracking-[0.24em] text-slate-500">
                Discover HASTON
              </p>
              <div className="flex flex-col gap-1">
                {navLinks.map((l, index) => {
                  const active = pathname === l.to || pathname.startsWith(`${l.to}/`);
                  return (
                    <Link
                      key={l.label}
                      to={l.to}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`group flex min-h-[52px] items-center justify-between rounded-sm border-l-2 px-4 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D4AF37] ${
                        active
                          ? "border-[#D4AF37] bg-[#0A1931]/[0.05] text-[#0A1931]"
                          : "border-transparent text-[#0A1931]/80 hover:border-[#D4AF37]/70 hover:bg-[#0A1931]/[0.04] hover:text-[#0A1931]"
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <span className="w-4 text-[9px] tabular-nums tracking-[0.12em] text-[#D4AF37]">
                          0{index + 1}
                        </span>
                        <span className="text-display text-[17px] uppercase tracking-[0.13em] sm:text-lg">
                          {l.label}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 text-[#D4AF37] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                        strokeWidth={1.5}
                      />
                    </Link>
                  );
                })}
              </div>
              <div className="mt-6 border-t border-[#0A1931]/10 pt-5">
                <p className="px-1 pb-3 text-[9px] uppercase tracking-[0.24em] text-slate-500">
                  Your HASTON
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Account", to: "/account", Icon: User },
                    { label: "Wishlist", to: "/wishlist", Icon: Heart },
                    { label: "Track Order", to: "/order-tracking", Icon: PackageSearch },
                    { label: "Support", to: "/support", Icon: Headphones },
                  ].map(({ label, to, Icon }) => {
                    const active = pathname === to || pathname.startsWith(`${to}/`);
                    return (
                      <Link
                        key={label}
                        to={to}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-[48px] items-center gap-2.5 rounded-sm border px-3 py-2 text-[9px] font-medium uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D4AF37] sm:gap-3 sm:px-3.5 sm:text-[10px] ${
                          active
                            ? "border-[#D4AF37]/50 bg-[#0A1931]/[0.05] text-[#0A1931]"
                            : "border-[#0A1931]/10 text-[#0A1931]/75 hover:border-[#D4AF37]/50 hover:bg-[#0A1931]/[0.04] hover:text-[#0A1931]"
                        }`}
                      >
                        <Icon
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-[#D4AF37]"
                          strokeWidth={1.5}
                        />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
