import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/haston-data";
import { PageHero } from "@/components/ui-haston/PageHero";
import { Package } from "lucide-react";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders — HASTON" },
      { name: "description", content: "Your HASTON order history." },
    ],
  }),
  component: Orders,
});

function Orders() {
  const orders = [
    {
      id: "HV-10238",
      date: "May 18, 2025",
      total: 465,
      status: "In transit",
      items: [PRODUCTS[0], PRODUCTS[3]],
    },
    {
      id: "HV-09918",
      date: "March 02, 2025",
      total: 210,
      status: "Delivered",
      items: [PRODUCTS[2]],
    },
    {
      id: "HV-09721",
      date: "January 14, 2025",
      total: 285,
      status: "Delivered",
      items: [PRODUCTS[1]],
    },
  ];
  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Your orders."
        breadcrumb={[{ label: "Account", to: "/account" }, { label: "Orders" }]}
      />
      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-10">
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-md border border-border bg-card p-6 soft-shadow">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Package className="h-5 w-5 text-accent" strokeWidth={1.4} />
                  <div>
                    <p className="text-display text-xl">{o.id}</p>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      {o.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">${o.total}</p>
                  <p
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.28em] ${o.status === "Delivered" ? "bg-accent/20 text-accent" : "bg-mustard/25 text-graphite"}`}
                  >
                    {o.status}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {o.items.map((i) => (
                  <img key={i.id} src={i.image} alt="" className="h-24 w-20 rounded object-cover" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
