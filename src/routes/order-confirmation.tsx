import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Package } from "lucide-react";
import { inr } from "@/lib/haston-data";
import { readConfirmedOrder, type CreatedOrder } from "@/lib/mock-commerce";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";

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
  const [order, setOrder] = useState<CreatedOrder | null>(null);
  useEffect(() => setOrder(readConfirmedOrder()), []);

  if (!order) {
    return (
      <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-center">
        <div>
          <p className="text-eyebrow text-muted-foreground">No confirmation found</p>
          <h1 className="mt-4 text-display text-4xl">Nothing to show yet.</h1>
          <LuxeButton to="/collections" className="mt-8" arrow>
            Continue shopping
          </LuxeButton>
        </div>
      </section>
    );
  }

  const method =
    order.paymentMethod === "cod"
      ? "Cash on Delivery"
      : order.paymentMethod === "netbanking"
        ? "Net Banking"
        : order.paymentMethod === "upi"
          ? "UPI"
          : order.paymentMethod === "wallet"
            ? "Wallet"
            : "Credit / Debit Card";
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
              <p className="mt-1 text-display text-xl">{order.orderNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Payment</p>
            <p className="mt-1 text-sm">{method}</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 py-5">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-20 w-16 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm">{item.product.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {item.color} · Size {item.size} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm">{inr(item.product.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-border pt-5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="text-foreground">{inr(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className="text-foreground">
              {order.shipping === 0 ? "Complimentary" : inr(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between pt-3 text-lg">
            <span className="text-display">Total</span>
            <span className="font-medium">{inr(order.total)}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <LuxeButton to="/collections" arrow>
          Continue shopping
        </LuxeButton>
        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          This is a demo order. No real payment was processed.
        </p>
      </div>
    </section>
  );
}
