import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function CategoryCard({
  slug,
  name,
  tagline,
  image,
  index = 0,
}: {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to="/collections/$slug" params={{ slug }} className="group relative block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm soft-shadow">
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/15 to-transparent" />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{ boxShadow: "inset 0 0 50px oklch(0.965 0.018 92 / 0.2)" }}
          />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4 text-ivory">
            <p className="text-[7.5px] uppercase tracking-[0.24em] opacity-80">{tagline}</p>
            <h3 className="text-display text-sm leading-tight md:text-base">{name}</h3>
            <span className="mt-1 inline-flex items-center gap-1.5 text-[8px] uppercase tracking-[0.24em]">
              <span className="relative">
                Explore
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-100 bg-current transition-transform duration-500 group-hover:origin-right group-hover:scale-x-0" />
              </span>
              <ArrowUpRight className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
