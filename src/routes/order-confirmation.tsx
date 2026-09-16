import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Check, Package } from "lucide-react";
import { inr } from "@/lib/haston-data";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { useQuery } from "@tanstack/react-query";
import { hastonApi } from "@/lib/haston-api";
import { useHastonSession } from "@/hooks/use-haston-session";
import { ApiError } from "@/lib/api-client";
import { clearSession } from "@/lib/haston-session";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — HASTON" },
      { name: "description", content: "Your HASTON order confirmation." },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const session = useHastonSession();
  const navigate = useNavigate();
  const orderId = Number(new URLSearchParams(window.location.search).get("orderId"));
  const validOrderId = Number.isInteger(orderId) && orderId > 0;
  const { data: order, isLoading, error } = useQuery({
    queryKey: ["haston", "order", orderId],
    queryFn: () => hastonApi.order(orderId),
    enabled: Boolean(session) && validOrderId,
  });

  useEffect(() => {
    if (!session) {
      void navigate({ to: "/login", replace: true });
    }
  }, [navigate, session]);

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      clearSession();
      void navigate({ to: "/login", replace: true });
    }
  }, [error, navigate]);

  if (!session) return null;
  if (isLoading) {
    return <p className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-sm text-muted-foreground">Loading your order...</p>;
  }
  if (!validOrderId || error || !order) {
    return (
      <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-center">
        <div>
          <p className="text-eyebrow text-muted-foreground">Order unavailable</p>
          <h1 className="mt-4 text-display text-4xl">We could not load this order.</h1>
          <LuxeButton to="/orders" className="mt-8" arrow>
            View your orders
          </LuxeButton>
        </div>
      </section>
    );
  }

  const method = "Payment details unavailable";
  return (
    <section className="mx-auto max-w-3xl px-6 py-14 md:py-20">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground">
          <Check className="h-7 w-7" />
        </div>
        <p className="mt-8 text-eyebrow text-muted-foreground">Order confirmed</p>
        <h1 className="mt-3 text-display text-5xl">Thank you.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Your HASTON order has been placed successfully.
        </p>
      </div>
      <div className="mt-12 rounded-md border border-border bg-card p-6 soft-shadow md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-accent" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Order number
              </p>
              <p className="mt-1 text-display text-xl">{order.id}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Payment</p>
            <p className="mt-1 text-sm">{method}</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 py-5">
              <img
                src={item.product.image || undefined}
                alt={item.product.name}
                className="h-20 w-16 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm">{item.product.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {item.variant?.color || "Selected"} · Size {item.variant?.size || "Standard"} ·
                  Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm">{inr(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-border pt-5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="text-foreground">
              {inr(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className="text-foreground">
              {inr(
                Math.max(
                  0,
                  order.totalPrice -
                    order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
                ),
              )}
            </span>
          </div>
          <div className="flex justify-between pt-3 text-lg">
            <span className="text-display">Total</span>
            <span className="font-medium">{inr(order.totalPrice)}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <LuxeButton to="/collections" arrow>
          Continue shopping
        </LuxeButton>
        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Your order has been saved to your HASTON account.
        </p>
      </div>
    </section>
  );
}
