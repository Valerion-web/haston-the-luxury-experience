import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IMG } from "@/lib/haston-data";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";

type Slide = {
  eyebrow: string;
  title: [string, string, string];
  copy: string;
  image: string;
  video?: string;
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
  spec: { label: string; value: string };
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Summer Collection — Vol. 08",
    title: ["Comfort", "that defines", "everyday."],
    copy: "Premium fabrics, thoughtful design, and unhurried silhouettes for men who dress with intention.",
    image: IMG.hero,
    primary: { label: "Shop Now", to: "/collections/new-arrivals" },
    secondary: { label: "Explore Collection", to: "/collections" },
    spec: { label: "Fabric", value: "Belgian Linen" },
  },
  {
    eyebrow: "Linen Collection",
    title: ["Light.", "Breathable.", "Refined."],
    copy: "Belgian linen, garment-washed and softened over 60 hours. Made for the slow afternoons.",
    image: IMG.lb1,
    primary: { label: "Shop Now", to: "/collections/shirts" },
    secondary: { label: "Explore Collection", to: "/collections" },
    spec: { label: "Edition", value: "Limited 240 pcs" },
  },
  {
    eyebrow: "Premium Cotton Series",
    title: ["Built to", "wear-in,", "not out."],
    copy: "Long-staple cotton, milled in Italy. The essential wardrobe that only gets better.",
    image: IMG.catShirts,
    primary: { label: "Shop Now", to: "/collections/shirts" },
    secondary: { label: "Explore Collection", to: "/collections" },
    spec: { label: "Craft", value: "Milled in Italy" },
  },
  {
    eyebrow: "Office Wear",
    title: ["The Monday", "to Friday", "wardrobe."],
    copy: "Structured tailoring with a modern ease. Trousers and shirts that carry the whole week.",
    image: IMG.catTrousers,
    primary: { label: "Shop Now", to: "/collections/trousers" },
    secondary: { label: "Explore Collection", to: "/collections" },
    spec: { label: "Tailoring", value: "Half-lined Wool" },
  },
  {
    eyebrow: "Weekend Wear",
    title: ["Slow", "Saturdays,", "sharper style."],
    copy: "Overshirts, knits and easy layers built for a considered kind of downtime.",
    image: IMG.lb2,
    primary: { label: "Shop Now", to: "/collections/knitwear" },
    secondary: { label: "Explore Collection", to: "/collections" },
    spec: { label: "Season", value: "AW · Volume 07" },
  },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

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

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, [paused]);

  const slide = SLIDES[idx];

  return (
    <section
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative isolate min-h-[540px] md:min-h-[620px] md:max-h-[720px] overflow-hidden bg-primary text-primary-foreground"
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

      <div className="relative z-10 mx-auto grid min-h-[540px] md:min-h-[620px] md:max-h-[720px] max-w-[1600px] grid-cols-1 items-center gap-6 px-6 pb-10 pt-14 md:grid-cols-[1.1fr_1fr] md:px-10 md:pb-14 md:pt-18">
        {/* Copy */}
        <motion.div style={{ y: textY, opacity }} className="relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[8px] uppercase tracking-[0.3em] text-sand/80">
                {slide.eyebrow}
              </p>

              <h1 className="mt-6 text-display text-[clamp(1.7rem,4vw,3.4rem)] leading-[1.16] uppercase">
                <span className="block overflow-hidden pb-[0.12em]">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {slide.title[0]}
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-[0.12em]">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.17, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-sand"
                  >
                    {slide.title[1]}
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-[0.12em]">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.29, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {slide.title[2]}
                  </motion.span>
                </span>
              </h1>

              <p className="mt-5 max-w-md text-[11px] leading-relaxed text-primary-foreground/75">
                {slide.copy}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <LuxeButton to={slide.primary.to} variant="ivory" arrow>
                  {slide.primary.label}
                </LuxeButton>
                <LuxeButton to={slide.secondary.to} variant="outline" className="text-ivory">
                  {slide.secondary.label}
                </LuxeButton>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators */}
          <div className="mt-7 flex items-center gap-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className="group relative h-1 w-10 overflow-hidden rounded-full bg-primary-foreground/20"
              >
                <span
                  className={`absolute inset-y-0 left-0 bg-primary-foreground transition-[width] duration-[6500ms] ease-linear ${
                    i === idx && !paused ? "w-full" : i < idx ? "w-full" : "w-0"
                  }`}
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Image composition */}
        <motion.div style={{ y: parallaxY }} className="relative aspect-[4/5] w-full max-h-[560px]">
          <motion.div
            style={{ x: imgX, y: imgY, scale }}
            className="absolute inset-0 overflow-hidden rounded-md luxe-shadow"
          >
            {slide.video ? (
              <video
                key={slide.video}
                src={slide.video}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <AnimatePresence mode="wait">
                <motion.img
                  key={slide.image}
                  src={slide.image}
                  alt={slide.eyebrow}
                  initial={{ scale: 1.15, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.05, opacity: 0 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
          </motion.div>

          {/* Floating spec cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute -left-4 top-16 hidden animate-float glass-panel rounded-md px-5 py-4 text-navy md:block"
            style={{ animationDelay: "-2s" }}
          >
            <p className="text-[9px] uppercase tracking-[0.32em] opacity-60">{slide.spec.label}</p>
            <p className="mt-1 text-display text-lg">{slide.spec.value}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute -right-4 bottom-16 hidden animate-float glass-panel rounded-md px-5 py-4 text-navy md:block"
          >
            <p className="text-[9px] uppercase tracking-[0.32em] opacity-60">Season</p>
            <p className="mt-1 text-display text-lg">AW · Vol. 07</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
