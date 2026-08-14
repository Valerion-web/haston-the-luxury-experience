import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { IMG } from "@/lib/haston-data";
import { PageHero } from "@/components/ui-haston/PageHero";
import { Reveal, SplitHeading } from "@/components/ui-haston/Reveal";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About HASTON — Where Luxury Meets Everyday Life" },
      {
        name: "description",
        content:
          "HASTON by House of Valerion creates premium menswear built around quality, fit and fabric — luxury designed to be felt, not displayed.",
      },
      { property: "og:title", content: "About HASTON — Where Luxury Meets Everyday Life" },
      {
        property: "og:description",
        content: "Premium menswear built around quality, fit and fabric. Luxury you feel.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: About,
});

/** Editorial split section: image one side, copy the other. */
function Split({
  eyebrow,
  title,
  image,
  reverse,
  children,
}: {
  eyebrow: string;
  title: string;
  image: string;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={ref} className="mx-auto max-w-[1600px] px-6 py-9 md:px-10 md:py-11">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
        <motion.div
          style={{ y }}
          className={`overflow-hidden rounded-md luxe-shadow ${reverse ? "md:order-2" : ""}`}
        >
          <img
            src={image}
            alt=""
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition-transform duration-[1600ms] hover:scale-[1.04]"
          />
        </motion.div>
        <div className={reverse ? "md:order-1" : ""}>
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sand" />
              <p className="text-eyebrow text-gold">{eyebrow}</p>
            </div>
          </Reveal>
          <h2 className="mt-4 text-display text-[1.35rem] leading-[1.15] md:text-[1.85rem]">
            <SplitHeading text={title} />
          </h2>
          <Reveal delay={0.15}>
            <div className="mt-5 space-y-4 text-[14px] leading-[1.8] text-muted-foreground md:text-[15.5px]">
              {children}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const FABRICS = [
  {
    image: IMG.fabricLinen,
    name: "Linen",
    note: "Breathable and light, chosen for warm days and long evenings. It softens with every wear.",
  },
  {
    image: IMG.fabricKnit,
    name: "Fine knits",
    note: "Selected for softness and recovery — they hold their shape rather than stretch out of it.",
  },
  {
    image: IMG.fabricCotton,
    name: "Cotton",
    note: "Structured, durable, honest. Cotton that keeps colour and form through years of use.",
  },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About HASTON"
        title="Where luxury meets everyday life."
        description="HASTON by House of Valerion makes premium menswear for real days — considered, comfortable, and quietly confident."
        breadcrumb={[{ label: "About" }]}
        image={IMG.aboutHeroEditorial}
      />

      {/* Introduction */}
      <section className="mx-auto max-w-[1400px] px-6 py-7 md:px-10 md:py-8">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-sand" />
                <p className="text-eyebrow text-gold">Introduction</p>
              </div>
            </Reveal>
            <h2 className="mt-3 text-display text-[1.4rem] leading-[1.12] md:text-[1.9rem]">
              <SplitHeading text="Built around quality." />
            </h2>
            <Reveal delay={0.15}>
              <div className="mt-4 space-y-3.5 text-[14px] leading-[1.75] text-muted-foreground md:text-[15.5px]">
                <p>
                  HASTON is a premium menswear label from House of Valerion, created for men who
                  want clothing that feels as considered as it looks. Every piece is designed for
                  everyday life — not for occasions kept at a distance.
                </p>
                <p>
                  We believe luxury is not a logo or a season. It is the quiet confidence that comes
                  from wearing something made with purpose: the right fabric, the right fit, and
                  finishing that holds.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-md luxe-shadow">
                <img
                  src={IMG.aboutIntro}
                  alt="HASTON garments and materials"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover md:aspect-[5/4]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* Our Story */}
      <Split eyebrow="Our story" title="It began with a simple frustration." image={IMG.aboutOrigin}>
        <p>
          HASTON was created because too much of what is sold as premium is premium in price alone.
          Fabrics that disappoint after a season. Fits that look correct only while standing still.
          Details added for show rather than purpose.
        </p>
        <p>
          We started again from the basics — material first, then fit, then finishing — and kept only
          what improved the garment. Nothing was added to make a piece look expensive.
        </p>
        <p>
          The result is a wardrobe that is deliberately restrained: fewer pieces, made properly,
          intended to be worn for years rather than replaced each season.
        </p>
      </Split>

      {/* Philosophy */}
      <section className="border-y border-border bg-primary py-9 text-primary-foreground md:py-11">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sand" />
              <p className="text-eyebrow text-sand">Philosophy</p>
            </div>
          </Reveal>
          <h2 className="mt-4 max-w-3xl text-display text-[1.5rem] leading-[1.12] md:text-[2.1rem]">
            <SplitHeading text="Luxury should be felt, not displayed." />
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <Reveal delay={0.1}>
                <div className="overflow-hidden rounded-md">
                  <img
                    src={IMG.aboutPhilosophy}
                    alt="A quiet interior, HASTON philosophy"
                    loading="lazy"
                    className="aspect-[16/11] w-full object-cover"
                  />
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {[
                  {
                    t: "Not louder, better",
                    d: "We design for the person wearing the garment, never for attention.",
                  },
                  {
                    t: "Timeless over trend",
                    d: "Pieces that still feel right years after they were bought.",
                  },
                  {
                    t: "Made to be lived in",
                    d: "Work, travel, evenings, weekends — one garment, all of them.",
                  },
                ].map((v, i) => (
                  <Reveal key={v.t} delay={i * 0.1}>
                    <div className="hairline pt-5">
                      <p className="text-display text-base md:text-lg">{v.t}</p>
                      <p className="mt-2 text-[12.5px] leading-relaxed opacity-70">{v.d}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.3}>
                <p className="mt-7 max-w-xl text-[14px] leading-[1.8] opacity-80 md:text-[15.5px]">
                  When a garment behaves the way it should — the collar holding its shape, the seam
                  never asking to be adjusted — confidence follows quietly. Nothing needs to be
                  proven.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <Split
        eyebrow="Craftsmanship"
        title="The art of the perfect fit."
        image={IMG.aboutCraft}
        reverse
      >
        <p>
          A garment should follow the body naturally — never restricting, never overwhelming. Before
          any detail is decided, we settle proportion: the fall of a shoulder, the width of a sleeve,
          the length that sits correctly whether tucked or left out.
        </p>
        <p>
          Patterns are refined through real wearing, not only on a form. Each round of fitting
          removes a small compromise, and sometimes that means beginning again.
        </p>
        <p>
          Structure lives in the parts rarely seen — clean seams, considered interlinings, collars
          and cuffs built to keep their shape through repeated wear. Good finishing is not ornament;
          it is what keeps a piece true to its first day.
        </p>
      </Split>

      {/* Fabrics */}
      <section className="mx-auto max-w-[1600px] px-6 py-9 md:px-10 md:py-11">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-sand" />
            <p className="text-eyebrow text-gold">Fabrics</p>
          </div>
        </Reveal>
        <h2 className="mt-4 max-w-2xl text-display text-[1.5rem] leading-[1.12] md:text-[2.1rem]">
          <SplitHeading text="We begin with what you can feel." />
        </h2>
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-2xl text-[14px] leading-[1.8] text-muted-foreground md:text-[15.5px]">
            Every HASTON piece starts with material. Fabric is chosen by hand — for touch,
            durability and the way it behaves over years — because no specification can describe how
            a cloth feels once it is worn.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FABRICS.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <div className="group">
                <div className="overflow-hidden rounded-md">
                  <img
                    src={f.image}
                    alt={`${f.name} fabric detail`}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-display text-base md:text-lg">{f.name}</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{f.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* People */}
      <Split eyebrow="People" title="The HASTON man." image={IMG.aboutPeople}>
        <p>
          He is not defined by age or profession. He values quality over noise, chooses carefully,
          and keeps what works. He does not dress to be noticed — he dresses to feel prepared.
        </p>
        <p>
          The people who wear HASTON rarely describe the garment first. They describe how they felt
          in it: steadier, more at ease, more themselves. A well-made shirt changes posture before it
          changes an outfit.
        </p>
        <p>
          That is the effect we design toward — not admiration of the clothing, but ease in the
          person wearing it.
        </p>
      </Split>

      {/* Promise */}
      <section className="relative isolate overflow-hidden border-t border-border">
        <img
          src={IMG.aboutPromise}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="relative mx-auto max-w-[1000px] px-6 py-12 text-center text-primary-foreground md:py-16">
          <Reveal>
            <p className="text-eyebrow text-sand">Our promise</p>
          </Reveal>
          <h2 className="mt-4 text-display text-[1.5rem] leading-[1.15] md:text-[2.1rem]">
            <SplitHeading text="Made with purpose. Worn without thought." />
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-5 max-w-xl text-[13.5px] leading-[1.8] opacity-85 md:text-[15px]">
              We would rather delay a piece than release one that is only correct standing still.
              Quality first, always — so that wearing HASTON asks nothing of you.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <LuxeButton to="/journal" variant="ivory" arrow>
                Read the journal
              </LuxeButton>
              <LuxeButton to="/collections" variant="outline" arrow>
                Explore collections
              </LuxeButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
