import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hastonApi } from "@/lib/haston-api";

const STATUSES = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
export function AdminOrderDetailsView({ orderId }: { orderId: number }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["haston", "admin-order", orderId],
    queryFn: () => hastonApi.adminOrder(orderId),
    enabled: Number.isInteger(orderId) && orderId > 0,
  });
  const update = useMutation({
    mutationFn: (value: string) => hastonApi.updateAdminOrderStatus(orderId, value),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["haston", "admin-order", orderId] });
      await queryClient.invalidateQueries({ queryKey: ["haston", "admin-orders"] });
      setStatus("");
    },
  });
  if (isLoading) return <State message="Loading order details..." />;
  if (error || !order)
    return <State message={error instanceof Error ? error.message : "Order not found."} error />;
  const selected = status || order.status;
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = Math.max(0, order.totalPrice - subtotal);
  return (
    <section>
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
      </Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-eyebrow text-muted-foreground">Order details</p>
          <h1 className="mt-3 text-display text-4xl">Order {order.id}.</h1>
          <p className="mt-2 text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selected}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-md border border-border bg-card px-3 py-2 text-xs uppercase tracking-[0.16em] focus:border-primary focus:outline-none"
          >
            {STATUSES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <button
            onClick={() => update.mutate(selected)}
            disabled={update.isPending || selected === order.status}
            className="rounded-full bg-primary px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50"
          >
            {update.isPending ? "Updating" : "Update status"}
          </button>
        </div>
      </div>
      {update.error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {update.error instanceof Error ? update.error.message : "Unable to update order status."}
        </p>
      )}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="rounded-md border border-border bg-card p-6 soft-shadow">
          <p className="text-eyebrow">Items</p>
          <div className="mt-5 divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                <img
                  src={item.product.image || undefined}
                  alt={item.product.name}
                  className="h-24 w-20 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-display text-lg">{item.product.name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {item.variant?.color || "Variant unavailable"} · Size{" "}
                    {item.variant?.size || "Standard"} · Qty {item.quantity}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">Unit price {inr(item.price)}</p>
                </div>
                <p className="text-sm font-medium">{inr(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-md border border-border bg-card p-6 soft-shadow">
            <p className="text-eyebrow">Customer</p>
            <p className="mt-4 text-sm">{order.user?.name || "Name unavailable"}</p>
            <p className="mt-1 break-all text-xs text-muted-foreground">
              {order.user?.email || "Email unavailable"}
            </p>
            <p className="mt-6 text-eyebrow">Shipping address</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {address(order.shippingAddress)}
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-6 soft-shadow">
            <p className="text-eyebrow">Summary</p>
            <div className="mt-5 space-y-2 text-sm">
              <Row label="Subtotal" value={inr(subtotal)} />
              <Row label="Shipping" value={shipping ? inr(shipping) : "Complimentary"} />
              <div className="flex justify-between border-t border-border pt-3 text-lg">
                <span className="text-display">Grand total</span>
                <span className="font-medium">{inr(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
function formatDate(value?: string) {
  return value
    ? new Date(value).toLocaleDateString("en-IN", { dateStyle: "long" })
    : "Date unavailable";
}
function address(value?: string | null) {
  if (!value) return "Address unavailable";
  try {
    return (
      Object.values(JSON.parse(value) as Record<string, string>)
        .filter(Boolean)
        .join("\n") || "Address unavailable"
    );
  } catch {
    return value;
  }
}
function inr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
function State({ message, error = false }: { message: string; error?: boolean }) {
  return (
    <section className="grid min-h-[50vh] place-items-center text-center">
      <div>
        <p className="text-eyebrow text-muted-foreground">
          {error ? "Order unavailable" : "Orders"}
        </p>
        <h1 className="mt-4 text-display text-3xl">{message}</h1>
        <Link
          to="/admin/orders"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[10px] uppercase tracking-[0.2em]"
        >
          Back to orders
        </Link>
      </div>
    </section>
  );
}
