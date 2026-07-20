import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — HASTON" },
      { name: "description", content: "HASTON terms of service." },
    ],
  }),
  component: Terms,
});

const sections = [
  {
    title: "Acceptance",
    body: "By using haston.house you agree to these terms. If you don't, please don't use the site — but we'd rather you did.",
  },
  {
    title: "Orders",
    body: "An order is an offer to purchase. We reserve the right to refuse or cancel orders — extremely rarely, and only for good reason (pricing errors, stock issues, suspected fraud).",
  },
  {
    title: "Pricing",
    body: "All prices are shown in the currency of your region and include VAT where applicable. Duties for shipments outside the EU are calculated at checkout.",
  },
  {
    title: "Intellectual property",
    body: "All content on this site — photography, copy, garment designs — belongs to House of Valerion. Please don't reproduce it without asking us first.",
  },
  {
    title: "Governing law",
    body: "These terms are governed by the laws of Italy. Disputes are settled in the courts of Milan.",
  },
];

function Terms() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of service."
        description="Last updated May 2025."
        breadcrumb={[{ label: "Terms" }]}
      />
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
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
