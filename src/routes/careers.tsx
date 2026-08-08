import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — HASTON" },
      {
        name: "description",
        content: "Open roles at HASTON by House of Valerion — design, retail, product and technology.",
      },
    ],
  }),
  component: Careers,
});

const roles = [
  { title: "Senior Menswear Designer", place: "Mumbai", type: "Full-time" },
  { title: "Retail Experience Manager", place: "Bengaluru", type: "Full-time" },
  { title: "Fabric & Sourcing Lead", place: "Tiruppur", type: "Full-time" },
  { title: "E-commerce Merchandiser", place: "Remote, India", type: "Full-time" },
  { title: "Brand Content Producer", place: "Mumbai", type: "Contract" },
];

function Careers() {
  return (
    <>
      <PageHero
        eyebrow="House of Valerion"
        title="Careers at HASTON."
        description="Build a quietly confident brand with people who care about craft."
        breadcrumb={[{ label: "Careers" }]}
      />
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-10">
        <p className="text-sm leading-relaxed text-muted-foreground">
          We hire for taste, rigour and generosity. Write to us at careers@haston.house with the role
          you're interested in and a short note on the work you're proudest of.
        </p>
        <ul className="mt-8 divide-y divide-border">
          {roles.map((r) => (
            <li key={r.title} className="flex flex-wrap items-center justify-between gap-2 py-4">
              <div>
                <p className="text-display text-base">{r.title}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {r.place}
                </p>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {r.type}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
