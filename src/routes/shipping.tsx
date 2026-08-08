import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — HASTON" },
      {
        name: "description",
        content: "HASTON shipping options, delivery timelines and charges across India and worldwide.",
      },
    ],
  }),
  component: Shipping,
});

const sections = [
  {
    title: "Standard delivery",
    body: "Complimentary on all orders above ₹15,000. Delivered in 4–6 business days across India, 7–10 business days internationally.",
  },
  {
    title: "Express delivery",
    body: "₹1,530 flat. Delivered in 2–3 business days in metro cities, 3–4 business days elsewhere in India.",
  },
  {
    title: "Cash on delivery",
    body: "Available on orders up to ₹40,000 across 24,000+ pin codes. A nominal handling fee of ₹99 applies.",
  },
  {
    title: "Order tracking",
    body: "Every dispatch includes an AWB number and a tracking link by SMS and email. You can also track any order from the Order Tracking page.",
  },
  {
    title: "Duties & taxes",
    body: "Indian orders are inclusive of GST. International shipments may attract customs duties payable on delivery, as per destination regulations.",
  },
];

function Shipping() {
  return (
    <>
      <PageHero
        eyebrow="Customer Care"
        title="Shipping & delivery."
        description="How your HASTON order reaches you."
        breadcrumb={[{ label: "Shipping" }]}
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
