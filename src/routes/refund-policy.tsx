import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — HASTON" },
      { name: "description", content: "HASTON returns and refund policy." },
    ],
  }),
  component: Refund,
});

const sections = [
  {
    title: "30-day returns",
    body: "Return any unworn piece within 30 days of delivery, with its original tags, for a full refund. No forms, no calls.",
  },
  {
    title: "How to return",
    body: "Log in, choose the order and select 'Return'. We'll email you a prepaid label. Drop the parcel at any carrier point.",
  },
  {
    title: "Refund timing",
    body: "Refunds land on your original payment method within 5–7 business days of us receiving your return.",
  },
  {
    title: "Store credit alternative",
    body: "Choose store credit at checkout for an extra 10% on your refund — usable across the site and in every boutique.",
  },
  {
    title: "Exceptions",
    body: "Personalised or altered pieces cannot be returned unless faulty. Faulty pieces are covered under a lifetime guarantee — email client@haston.house.",
  },
];

function Refund() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Refund policy."
        description="Fair, unhurried, human."
        breadcrumb={[{ label: "Refunds" }]}
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
