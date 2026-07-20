import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({ meta: [{ title: "Privacy Policy — HASTON" }, { name: "description", content: "How HASTON handles your personal data." }] }),
  component: Privacy,
});

function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy." description="Last updated May 2025." breadcrumb={[{ label: "Privacy" }]} />
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        {sections.map(s => (
          <section key={s.title}>
            <h2 className="text-display text-2xl text-foreground">{s.title}</h2>
            <p className="mt-3">{s.body}</p>
          </section>
        ))}
      </article>
    </>
  );
}

const sections = [
  { title: "The information we collect", body: "We collect only the information required to serve you well — your name, email, delivery details, order history and, when you tell us, your preferences. We never sell it." },
  { title: "How we use it", body: "To ship your orders, respond to your questions, and — if you've asked — to send you letters from the atelier. Nothing more." },
  { title: "Cookies", body: "A small, essential cookie keeps your bag intact between visits. Anonymous analytics help us understand where the site is slow or broken." },
  { title: "Your rights", body: "Request a copy of your data, or ask us to delete it, at any time. Email privacy@haston.house — we reply within 72 hours." },
  { title: "Contact", body: "House of Valerion, Via della Spiga 27, 20121 Milano, Italy. privacy@haston.house" },
];
