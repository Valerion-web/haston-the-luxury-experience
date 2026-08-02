import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { motion } from "framer-motion";

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

      <div className="relative mx-auto max-w-[1600px] px-6 py-14 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]"
        >
          <div>
            <p className="text-display text-4xl tracking-[0.14em] md:text-3xl">HASTON</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.4em] opacity-70">
              by House of Valerion
            </p>
            <p className="mt-8 max-w-sm text-sm leading-relaxed opacity-80">
              Premium casual wear built on considered materials, timeless silhouettes and the quiet
              confidence of everyday elegance.
            </p>
            <div className="mt-8 flex gap-4">
              {[Instagram, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-11 w-11 place-items-center rounded-full border border-primary-foreground/20 transition-all hover:bg-primary-foreground hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[10px] uppercase tracking-[0.32em] opacity-60">{col.title}</p>
              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="group inline-flex text-sm opacity-90 transition-opacity hover:opacity-100"
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

        <div className="mt-6 flex flex-col items-start justify-between gap-6 border-t border-primary-foreground/15 pt-8 text-[11px] uppercase tracking-[0.28em] opacity-60 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} House of Valerion. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
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
