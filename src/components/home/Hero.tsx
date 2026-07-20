import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import { IMG } from "@/lib/haston-data";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const imgX = useTransform(smx, [-1, 1], [-20, 20]);
  const imgY = useTransform(smy, [-1, 1], [-20, 20]);
  const glowX = useTransform(smx, [-1, 1], [-80, 80]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[92vh] overflow-hidden bg-primary text-primary-foreground"
    >
      {/* Ambient glow */}
      <motion.div
        style={{ x: glowX }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
      >
        <div
          className="absolute -left-40 top-1/4 h-[70vh] w-[70vh] rounded-full blur-[140px]"
          style={{
            background: "radial-gradient(circle, oklch(0.83 0.035 82 / 0.35), transparent 60%)",
          }}
        />
        <div
          className="absolute -right-40 bottom-0 h-[60vh] w-[60vh] rounded-full blur-[140px]"
          style={{
            background: "radial-gradient(circle, oklch(0.47 0.045 130 / 0.35), transparent 60%)",
          }}
        />
      </motion.div>

      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-[92vh] max-w-[1600px] grid-cols-1 items-center gap-10 px-6 pb-16 pt-24 md:grid-cols-[1.1fr_1fr] md:px-10 md:pb-24 md:pt-32">
        {/* Copy */}
        <motion.div style={{ y: textY, opacity }} className="relative z-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.4em] text-primary-foreground/70"
          >
            Autumn / Winter — Vol. 07
          </motion.p>

          <h1 className="mt-6 text-display text-[clamp(3rem,7vw,6.75rem)] leading-[0.95]">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                Comfort
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="block italic"
              >
                that defines
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                everyday.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-8 max-w-md text-base leading-relaxed text-primary-foreground/75"
          >
            Premium fabrics, thoughtful design, and unhurried silhouettes for men who dress with
            intention.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.05 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <LuxeButton to="/collections/new-arrivals" variant="ivory" arrow>
              Shop New Collection
            </LuxeButton>
            <LuxeButton to="/collections" variant="outline" className="text-ivory">
              Explore Collection
            </LuxeButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-16 hidden items-center gap-6 md:flex"
          >
            <div className="h-px w-16 bg-primary-foreground/40" />
            <p className="text-[10px] uppercase tracking-[0.32em] text-primary-foreground/50">
              Scroll to explore
            </p>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="h-8 w-px bg-primary-foreground/60"
            />
          </motion.div>
        </motion.div>

        {/* Image composition */}
        <motion.div style={{ y: parallaxY }} className="relative aspect-[3/4] w-full">
          <motion.div
            style={{ x: imgX, y: imgY, scale }}
            className="absolute inset-0 overflow-hidden rounded-md luxe-shadow"
          >
            <motion.img
              src={IMG.hero}
              alt="HASTON autumn collection"
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
          </motion.div>

          {/* Floating spec cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="absolute -left-4 top-16 hidden animate-float glass-panel rounded-md px-5 py-4 text-navy md:block"
            style={{ animationDelay: "-2s" }}
          >
            <p className="text-[9px] uppercase tracking-[0.32em] opacity-60">Fabric</p>
            <p className="mt-1 text-display text-lg">Belgian Linen</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute -right-4 bottom-16 hidden animate-float glass-panel rounded-md px-5 py-4 text-navy md:block"
          >
            <p className="text-[9px] uppercase tracking-[0.32em] opacity-60">Edition</p>
            <p className="mt-1 text-display text-lg">Limited 240 pcs</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
