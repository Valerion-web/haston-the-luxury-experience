import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";

export const Route = createFileRoute("/size-guide")({
  head: () => ({
    meta: [
      { title: "Size Guide — HASTON" },
      {
        name: "description",
        content: "HASTON size guide for shirts, knitwear, trousers and outerwear with measurements in inches.",
      },
    ],
  }),
  component: SizeGuide,
});

const tops = [
  { size: "S", chest: "38", shoulder: "17", length: "27" },
  { size: "M", chest: "40", shoulder: "17.5", length: "28" },
  { size: "L", chest: "42", shoulder: "18", length: "29" },
  { size: "XL", chest: "44", shoulder: "18.5", length: "30" },
];

const bottoms = [
  { size: "28", waist: "28", hip: "37", inseam: "31" },
  { size: "30", waist: "30", hip: "39", inseam: "31" },
  { size: "32", waist: "32", hip: "41", inseam: "32" },
  { size: "34", waist: "34", hip: "43", inseam: "32" },
  { size: "36", waist: "36", hip: "45", inseam: "32" },
];

function SizeGuide() {
  return (
    <>
      <PageHero
        eyebrow="Customer Care"
        title="Size guide."
        description="All measurements in inches. Garment measured flat."
        breadcrumb={[{ label: "Size Guide" }]}
      />
      <div className="mx-auto max-w-4xl space-y-10 px-6 py-10 md:px-10">
        <section>
          <h2 className="text-display text-2xl">Shirts, knitwear & outerwear</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="py-3">Size</th>
                  <th className="py-3">Chest</th>
                  <th className="py-3">Shoulder</th>
                  <th className="py-3">Length</th>
                </tr>
              </thead>
              <tbody>
                {tops.map((r) => (
                  <tr key={r.size} className="border-b border-border/60">
                    <td className="py-3">{r.size}</td>
                    <td className="py-3">{r.chest}</td>
                    <td className="py-3">{r.shoulder}</td>
                    <td className="py-3">{r.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-display text-2xl">Trousers & shorts</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="py-3">Size</th>
                  <th className="py-3">Waist</th>
                  <th className="py-3">Hip</th>
                  <th className="py-3">Inseam</th>
                </tr>
              </thead>
              <tbody>
                {bottoms.map((r) => (
                  <tr key={r.size} className="border-b border-border/60">
                    <td className="py-3">{r.size}</td>
                    <td className="py-3">{r.waist}</td>
                    <td className="py-3">{r.hip}</td>
                    <td className="py-3">{r.inseam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-sm text-muted-foreground">
          Between two sizes? Choose the larger for a relaxed drape, the smaller for a closer fit.
          Complimentary alterations are available on every full-price purchase.
        </p>
      </div>
    </>
  );
}
