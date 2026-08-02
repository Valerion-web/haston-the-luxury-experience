import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Facebook, ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/haston-logo.png.asset.json";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", to: "/collections/new-arrivals" },
      { label: "Best Sellers", to: "/collections/bestsellers" },
      { label: "Knitwear", to: "/collections/knitwear" },
      { label: "Shirts", to: "/collections/shirts" },
      { label: "Trousers", to: "/collections/trousers" },
      { label: "Outerwear", to: "/collections/outerwear" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Support", to: "/support" },
      { label: "Order Tracking", to: "/order-tracking" },
      { label: "Shipping", to: "/support" },
      { label: "Returns", to: "/refund-policy" },
      { label: "Size Guide", to: "/support" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "House of Valerion",
    links: [
      { label: "About HASTON", to: "/about" },
      { label: "Journal", to: "/journal" },
      { label: "Store Locator", to: "/store-locator" },
      { label: "Careers", to: "/about" },
      { label: "Press", to: "/journal" },
      { label: "Sustainability", to: "/about" },
    ],
  },
];

const badges = [
  { icon: Truck, label: "Free Shipping ₹999+" },
  { icon: RotateCcw, label: "7-Day Returns" },
  { icon: ShieldCheck, label: "Secure Payments" },
  { icon: Lock, label: "SSL Encrypted" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(246,243,224,0.5), transparent 40%), radial-gradient(circle at 80% 70%, rgba(216,200,178,0.4), transparent 40%)",
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-12">
        <div className="grid grid-cols-2 gap-4 border-b border-primary-foreground/12 pb-6 md:grid-cols-4">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-2.5">
              <b.icon className="h-3.5 w-3.5 opacity-70" strokeWidth={1.4} />
              <span className="text-[7.5px] uppercase tracking-[0.2em] opacity-75">{b.label}</span>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]"
        >
          <div>
            <img
              src={logo.url}
              alt="HASTON"
              loading="lazy"
              className="h-11 w-auto object-contain brightness-0 invert-0 mix-blend-screen"
            />
            <p className="mt-2 text-[7.5px] uppercase tracking-[0.22em] opacity-70">
              by House of Valerion
            </p>
            <p className="mt-4 max-w-xs text-[10px] leading-relaxed opacity-75">
              Premium casual wear built on considered materials, timeless silhouettes and the quiet
              confidence of everyday elegance.
            </p>
            <div className="mt-5 flex gap-2.5">
              {[Instagram, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social"
                  className="grid h-8 w-8 place-items-center rounded-full border border-primary-foreground/20 transition-all duration-500 hover:-translate-y-0.5 hover:bg-primary-foreground hover:text-primary"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.4} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[8px] uppercase tracking-[0.22em] text-sand/80">{col.title}</p>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="group inline-flex text-[10px] opacity-80 transition-opacity hover:opacity-100"
                    >
                      <span className="relative">
                        {l.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-primary-foreground/15 pt-5 text-[8px] uppercase tracking-[0.18em] opacity-60 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} House of Valerion. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/refund-policy">Refunds</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
