import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/cancellation-policy")({
  head: () => ({ meta: [{ title: "Cancellation Policy — HASTON" }] }),
  component: CancellationPolicy,
});
const sections = [
  {
    title: "Before dispatch",
    body: "You may request cancellation while your order is being prepared. Contact client service with your order number and we will confirm whether cancellation is still possible.",
  },
  {
    title: "After dispatch",
    body: "Once an order has left our atelier, cancellation is no longer available. You can use our returns process after delivery.",
  },
  {
    title: "Refunds",
    body: "Approved cancellations are refunded to the original payment method. Processing times depend on your bank or payment provider.",
  },
];
function CancellationPolicy() {
  return (
    <>
      <PageHero
        eyebrow="Customer Care"
        title="Cancellation policy."
        description="Clear terms for changing your mind."
        breadcrumb={[{ label: "Cancellation Policy" }]}
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
