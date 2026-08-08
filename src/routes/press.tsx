import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press — HASTON" },
      {
        name: "description",
        content: "HASTON press coverage, brand assets and media enquiries.",
      },
    ],
  }),
  component: Press,
});

const coverage = [
  { pub: "Vogue India", line: "The new grammar of Indian menswear", year: "2026" },
  { pub: "GQ India", line: "HASTON and the case for quiet clothes", year: "2025" },
  { pub: "Elle Decor", line: "Inside the House of Valerion atelier", year: "2025" },
  { pub: "Business of Fashion", line: "Premium casualwear grows up", year: "2024" },
];

function Press() {
  return (
    <>
      <PageHero
        eyebrow="House of Valerion"
        title="Press & media."
        description="Coverage, assets and enquiries."
        breadcrumb={[{ label: "Press" }]}
      />
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-10">
        <p className="text-sm leading-relaxed text-muted-foreground">
          For interviews, imagery or samples, write to press@haston.house. We respond within two
          working days.
        </p>
        <ul className="mt-8 divide-y divide-border">
          {coverage.map((c) => (
            <li key={c.pub} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
              <div>
                <p className="text-display text-base">{c.pub}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.line}</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {c.year}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
