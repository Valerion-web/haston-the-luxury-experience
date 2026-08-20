import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Check, Package, Truck, Mail } from "lucide-react";
import { inr } from "@/lib/haston-data";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PAYMENT_METHODS } from "@/lib/payment/gateway";
import { getOrder } from "@/lib/checkout";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order confirmed — HASTON" },
      { name: "description", content: "Your HASTON order is confirmed." },
    ],
  }),
  component: Confirmation;
});

function Confirmation() {
  const order = useMemo(() => getOrder(), []);

  if (!order) {
    return (
      <section className="mx-auto grid max-w-[1600px] place-items-center px-6 py-16 text-center md:px-10">
        <h1 className="text-display text-3xl">No recent order found.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Once you complete a purchase, your confirmation appears here.
        </p>
        <LuxeButton to="/collections" className="mt-8" arrow>
          Continue shopping
        </LuxeButton>
      </section>
    );
  }

  const methodLabel =
    PAYMENT_METHODS.find((m) => m.id === order.method)?.label ?? order.method.toUpperCase();

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-10 md:px-10">
      <div className="rounded-md border border-border bg-card p-8 text-center soft-shadow md:p-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent">
          <Check className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <p className="text-eyebrow mt-6">Payment successful</p>
        <h1 className="text-display mt-3 text-3xl md:text-4xl">Your order is confirmed.</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Thank you, {order.details.fullName.split(" ")[0]}. We have emailed the receipt to{" "}
          {order.details.email}. Your pieces are being prepared in the atelier.
        </p>

        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
          <Stat label="Order ID" value={order.orderId} />
          <Stat label="Amount paid" value={order.method === "cod" ? "On delivery" : inr(order.totals.total)} />
          <Stat label="Payment method" value={methodLabel} />
        </div>

        <p className="mt-6 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Reference {order.paymentId}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <LuxeButton to="/collections" arrow>
            Continue shopping
          </LuxeButton>
          <LuxeButton to="/order-tracking" variant="outline">
            Track order
          </LuxeButton>
        </div>
      </div>

      <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_440px]">
        <div className="space-y-6">
          <div className="rounded-md border border-border bg-card p-6 md:p-8 soft-shadow">
            <p className="text-eyebrow">What happens next</p>
            <div className="mt-6 space-y-6">
              {[
                { icon: Mail, title: "Confirmation email", note: "Receipt and order details sent." },
                { icon: Package, title: "Prepared in atelier", note: "Quality-checked and packed within 24 hours." },
                { icon: Truck, title: "Dispatch", note: "Tracking link shared on SMS and email." },
              ].map((s) => (
                <div key={s.title} className="flex items-start gap-4">
                  <s.icon className="mt-0.5 h-5 w-5 text-accent" strokeWidth={1.4} />
                  <div>
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-6 md:p-8 soft-shadow">
            <p className="text-eyebrow">Shipping to</p>
            <p className="mt-4 text-sm">{order.details.fullName}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.details.address}, {order.details.city}, {order.details.state}{" "}
              {order.details.pincode}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{order.details.phone}</p>
          </div>
        </div>

        <aside>
          <OrderSummary items={order.items} totals={order.totals} title="Order details" />
        </aside>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-5">
      <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      <p className="text-display mt-2 text-lg">{value}</p>
    </div>
  );
}
