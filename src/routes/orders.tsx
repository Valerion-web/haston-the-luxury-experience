import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { inr } from "@/lib/haston-data";
import { PageHero } from "@/components/ui-haston/PageHero";
import { Package } from "lucide-react";
import { useHastonSession } from "@/hooks/use-haston-session";
import { useQuery } from "@tanstack/react-query";
import { hastonApi } from "@/lib/haston-api";
import { useEffect } from "react";

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
  const session = useHastonSession();
  const navigate = useNavigate();
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["haston", "orders"],
    queryFn: hastonApi.orders,
    enabled: Boolean(session),
  });
  useEffect(() => {
    if (!session) void navigate({ to: "/login", replace: true });
  }, [navigate, session]);
  if (!session) return null;
  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Your orders."
        breadcrumb={[{ label: "Account", to: "/account" }, { label: "Orders" }]}
      />
      <section className="mx-auto max-w-[1600px] px-6 py-10 md:px-10">
        {isLoading && <p className="text-sm text-muted-foreground">Loading your orders...</p>}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Unable to load your orders."}
          </p>
        )}
        {!isLoading && !error && orders.length === 0 && (
          <p className="text-sm text-muted-foreground">You have no orders yet.</p>
        )}
        <div className="space-y-4">
          {orders.map((o) => (
            <Link
              key={o.id}
              to="/order-details/$id"
              params={{ id: String(o.id) }}
              className="block rounded-md border border-border bg-card p-6 soft-shadow transition-shadow hover:soft-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Package className="h-5 w-5 text-accent" strokeWidth={1.4} />
                  <div>
                    <p className="text-display text-xl">HV-{o.id}</p>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })
                        : "Recent order"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{inr(o.totalPrice)}</p>
                  <p
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.28em] ${o.status === "Delivered" ? "bg-accent/20 text-accent" : "bg-mustard/25 text-graphite"}`}
                  >
                    {o.status}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {o.items.map((item) => (
                  <img
                    key={item.id}
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-24 w-20 rounded object-cover"
                  />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
