import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability — HASTON" },
      {
        name: "description",
        content: "How HASTON approaches materials, makers and longevity in premium menswear.",
      },
    ],
  }),
  component: Sustainability,
});

const sections = [
  {
    title: "Materials",
    body: "Over 80% of our fabrics are natural or regenerated — long-staple cotton, European linen, responsibly sourced merino. We publish fabric composition on every product page.",
  },
  {
    title: "Makers",
    body: "We work with a small set of long-term partner units in Tiruppur, Bengaluru and Ludhiana, audited annually for wages, hours and workplace safety.",
  },
  {
    title: "Longevity",
    body: "Garments are engineered for years, not seasons: reinforced seams, pre-shrunk fabrics and complimentary lifetime alterations to keep pieces in wear.",
  },
  {
    title: "Packaging",
    body: "Plastic-free mailers, recycled tissue and FSC-certified boxes. Returns reuse the original packaging by design.",
  },
];

function Sustainability() {
  return (
    <>
      <PageHero
        eyebrow="House of Valerion"
        title="Sustainability."
        description="Fewer, better, longer-lasting clothes."
        breadcrumb={[{ label: "Sustainability" }]}
      />
      <article className="mx-auto max-w-3xl space-y-8 px-6 py-10 text-sm leading-relaxed text-muted-foreground md:px-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-display text-2xl text-foreground">{s.title}</h2>
            <p className="mt-3">{s.body}</p>
          </section>
        ))}
      </article>
    </>
  );
}
