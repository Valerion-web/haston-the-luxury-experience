import { Link } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { hastonApi } from "@/lib/haston-api";

export function AdminOrdersView() {
  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({ queryKey: ["haston", "admin-orders"], queryFn: hastonApi.adminOrders });
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow text-muted-foreground">Fulfilment</p>
          <h1 className="mt-3 text-display text-4xl">Orders.</h1>
        </div>
        <button
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors hover:border-primary disabled:opacity-50"
        >
          <RefreshCw className={isFetching ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} /> Refresh
        </button>
      </div>
      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading orders...</p>}
      {error && (
        <p role="alert" className="mt-8 text-sm text-destructive">
          {error instanceof Error ? error.message : "Unable to load orders."}
        </p>
      )}
      {!isLoading && !error && orders.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No orders have been placed yet.</p>
      )}
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to="/admin/orders/$id"
            params={{ id: String(order.id) }}
            className="block rounded-md border border-border bg-card p-5 soft-shadow transition-shadow hover:shadow-md md:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  Order
                </p>
                <p className="mt-1 text-display text-xl">{order.id}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{inr(order.totalPrice)}</p>
                <span className="mt-2 inline-flex rounded-full bg-mustard/25 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-graphite">
                  {order.status}
                </span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
              <div>
                <p className="text-sm">{order.user?.name || "Unnamed customer"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {order.user?.email || "Email unavailable"}
                </p>
              </div>
              <div className="flex -space-x-2">
                {order.items.slice(0, 4).map((item) => (
                  <img
                    key={item.id}
                    src={item.product.image || undefined}
                    alt={item.product.name}
                    className="h-12 w-10 rounded border-2 border-card object-cover"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
function formatDate(value?: string) {
  return value
    ? new Date(value).toLocaleDateString("en-IN", { dateStyle: "long" })
    : "Date unavailable";
}
function inr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
