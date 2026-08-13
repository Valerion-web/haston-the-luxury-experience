import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { JOURNAL, getArticle } from "@/lib/haston-data";
import { Reveal, SplitHeading } from "@/components/ui-haston/Reveal";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    return {
      meta: [
        { title: a ? `${a.title} — HASTON Journal` : "HASTON Journal" },
        { name: "description", content: a?.excerpt ?? "The HASTON Journal." },
        { property: "og:title", content: a?.title ?? "HASTON Journal" },
        { property: "og:description", content: a?.excerpt ?? "" },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: Article,
});

function Article() {
  const { article } = Route.useLoaderData() as { article: NonNullable<ReturnType<typeof getArticle>> };
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  const more = JOURNAL.filter((j) => j.slug !== article.slug).slice(0, 3);

  return (
    <>
      <motion.div
        style={{ scaleX: bar }}
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-accent"
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <motion.img
          src={article.image}
          alt=""
          aria-hidden
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/92 via-navy/65 to-navy/35" />
        <div className="relative mx-auto flex min-h-[340px] max-w-[1000px] flex-col justify-end px-5 py-12 md:min-h-[440px] md:px-8 md:py-16">
          <p className="text-[9px] uppercase tracking-[0.24em] text-sand">
            {article.number} — {article.category} · {article.read} read
          </p>
          <h1 className="mt-4 text-display text-[1.7rem] leading-[1.12] text-primary-foreground sm:text-[2.2rem] md:text-[2.7rem]">
            <SplitHeading text={article.title} />
          </h1>
          <p className="mt-4 max-w-xl text-[11.5px] leading-relaxed text-primary-foreground/80">
            {article.excerpt}
          </p>
        </div>
      </section>

      {/* Body */}
      <article className="mx-auto max-w-[720px] px-6 py-9 md:py-12">
        <Reveal>
          <p className="text-[15px] leading-[1.75] text-foreground md:text-[17px]">
            {article.intro}
          </p>
        </Reveal>

        {article.sections.map((s, i) => (
          <Reveal key={i} delay={0.05}>
            <section className="mt-9">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-sand" />
                <h2 className="text-display text-lg leading-tight md:text-xl">{s.heading}</h2>
              </div>
              <div className="mt-4 space-y-4">
                {s.paragraphs.map((p, k) => (
                  <p key={k} className="text-[14px] leading-[1.8] text-muted-foreground md:text-[15.5px]">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          </Reveal>
        ))}

        <Reveal>
          <blockquote className="mt-10 hairline border-l-0 pt-8">
            <p className="text-display text-xl italic leading-[1.35] md:text-2xl">
              “{article.pullQuote}”
            </p>
          </blockquote>
        </Reveal>

        <Reveal>
          <p className="mt-8 text-[14px] leading-[1.8] text-muted-foreground md:text-[15.5px]">
            {article.closing}
          </p>
        </Reveal>

        <div className="mt-10">
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] transition-opacity hover:opacity-60"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All journal entries
          </Link>
        </div>
      </article>

      {/* More */}
      <section className="border-t border-border bg-secondary/25 py-9 md:py-10">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-sand" />
            <h2 className="text-display text-lg md:text-xl">Continue reading</h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {more.map((j, i) => (
              <motion.article
                key={j.slug}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
                className="group"
              >
                <Link to="/journal/$slug" params={{ slug: j.slug }}>
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={j.image}
                      alt=""
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                    {j.number} · {j.category}
                  </p>
                  <h3 className="mt-2 text-display text-base leading-snug md:text-lg">{j.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.24em]">
                    Read
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
