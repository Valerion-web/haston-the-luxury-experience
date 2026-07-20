import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";

export function CategoryCard({
  slug, name, tagline, image, index = 0,
}: { slug: string; name: string; tagline: string; image: string; index?: number }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-40, 40], [8, -8]), { stiffness: 120, damping: 15 });
  const ry = useSpring(useTransform(mx, [-40, 40], [-8, 8]), { stiffness: 120, damping: 15 });

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1400 }}
    >
      <Link
        to="/collections/$slug"
        params={{ slug }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative block"
      >
        <motion.div
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className="relative aspect-[3/4] overflow-hidden rounded-md luxe-shadow"
        >
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />

          {/* Glow border */}
          <div className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-700 group-hover:opacity-100"
               style={{ boxShadow: "inset 0 0 60px oklch(0.965 0.018 92 / 0.25)" }} />

          <div
            style={{ transform: "translateZ(60px)" }}
            className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-8 text-ivory"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-80">{tagline}</p>
            <h3 className="text-display text-4xl md:text-5xl">{name}</h3>
            <span className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em]">
              <span className="relative">
                Explore
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-100 bg-current transition-transform duration-500 group-hover:origin-right group-hover:scale-x-0" />
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
