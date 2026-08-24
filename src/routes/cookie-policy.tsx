import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({ meta: [{ title: "Cookie Policy — HASTON" }] }),
  component: CookiePolicy,
});
const sections = [
  {
    title: "Essential cookies",
    body: "A small number of cookies keep your session secure and help the house remember essential choices. They are required for account and checkout experiences.",
  },
  {
    title: "Measurement",
    body: "Anonymous performance signals help us understand where the site is slow or difficult to use. They do not sell or expose your personal information.",
  },
  {
    title: "Your choices",
    body: "You can control cookies through your browser settings. Disabling essential cookies may affect sign-in, bag and checkout functionality.",
  },
];
function CookiePolicy() {
  return (
    <>
      <PageHero
        eyebrow="House policies"
        title="Cookie policy."
        description="A clear note on the small technologies behind the house."
        breadcrumb={[{ label: "Cookie Policy" }]}
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
