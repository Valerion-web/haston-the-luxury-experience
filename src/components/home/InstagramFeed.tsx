import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { IMG } from "@/lib/haston-data";
import { SectionHeader } from "@/components/ui-haston/SectionHeader";

const grid = [IMG.p1, IMG.lb2, IMG.p3, IMG.lb1, IMG.p5, IMG.lb3];

export function InstagramFeed() {
  return (
    <section className="bg-secondary/40 py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <SectionHeader eyebrow="@haston.house" title="Follow the house." link={{ to: "/journal", label: "See more" }} />
        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-6">
          {grid.map((src, i) => (
            <motion.a
              key={i}
              href="#"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-square overflow-hidden rounded-md"
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 grid place-items-center bg-primary/0 opacity-0 transition-all duration-500 group-hover:bg-primary/70 group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-primary-foreground" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
