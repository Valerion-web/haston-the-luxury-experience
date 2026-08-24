import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/exchange-policy")({
  head: () => ({ meta: [{ title: "Exchange Policy — HASTON" }] }),
  component: ExchangePolicy,
});
const sections = [
  {
    title: "A considered exchange",
    body: "Exchange an unworn HASTON piece within 30 days of delivery for another size or colour, subject to availability.",
  },
  {
    title: "Condition",
    body: "Items must be unworn, unwashed and returned with all original tags and packaging. Made-to-measure pieces and final-sale items are not eligible.",
  },
  {
    title: "How it works",
    body: "Contact client service with your order number. We will arrange collection, inspect the piece and send the replacement once approved.",
  },
];
function ExchangePolicy() {
  return (
    <>
      <PageHero
        eyebrow="Customer Care"
        title="Exchange policy."
        description="The right fit, without the fuss."
        breadcrumb={[{ label: "Exchange Policy" }]}
      />
      <article className="mx-auto max-w-3xl space-y-10 px-6 py-12 text-sm leading-7 text-muted-foreground md:px-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-display text-2xl text-foreground">{section.title}</h2>
            <p className="mt-3">{section.body}</p>
          </section>
        ))}
      </article>
    </>
  );
}
