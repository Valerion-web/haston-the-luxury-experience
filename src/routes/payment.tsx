import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Lock, Check, Smartphone, CreditCard, Landmark, Wallet, Banknote } from "lucide-react";
import { inr } from "@/lib/haston-data";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PAYMENT_METHODS, paymentGateway } from "@/lib/payment/gateway";
import {
  clearCheckout,
  getCheckoutItems,
  getDetails,
  getTotals,
  saveOrder,
  type PaymentMethodId,
} from "@/lib/checkout";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Payment — HASTON" },
      { name: "description", content: "Complete your HASTON payment securely." },
    ],
  }),
  component: Payment,
});

const ICONS: Record<PaymentMethodId, typeof Smartphone> = {
  upi: Smartphone,
  card: CreditCard,
  netbanking: Landmark,
  wallet: Wallet,
  cod: Banknote,
};

function Payment() {
  const navigate = useNavigate();
  const items = useMemo(() => getCheckoutItems(), []);
  const totals = useMemo(() => getTotals(items), [items]);
  const details = useMemo(() => getDetails(), []);
  const [method, setMethod] = useState<PaymentMethodId>("upi");
  const [status, setStatus] = useState<"idle" | "processing" | "succeeded">("idle");

  useEffect(() => {
    if (!details) navigate({ to: "/checkout" });
  }, [details, navigate]);

  const pay = async () => {
    if (!details || status !== "idle") return;
    setStatus("processing");
    const res = await paymentGateway.pay({ items, details, totals, method });
    if (res.status !== "succeeded") {
      setStatus("idle");
      return;
    }
    // Order is created only now — after payment success.
    saveOrder({
      orderId: res.orderId,
      paymentId: res.paymentId,
      method,
      placedAt: new Date().toISOString(),
      items,
      details,
      totals,
    });
    setStatus("succeeded");
    clearCheckout();
    setTimeout(() => navigate({ to: "/order-confirmation" }), 1400);
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-10 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow">Step 2 of 2 — Payment</p>
          <h1 className="text-display mt-2 text-3xl md:text-4xl">Payment</h1>
        </div>
        <Link
          to="/checkout"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Edit details
        </Link>
      </div>

      <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_440px]">
        <div className="space-y-6">
          {details && (
            <div className="rounded-md border border-border bg-card p-6 md:p-8 soft-shadow">
              <p className="text-eyebrow">Delivering to</p>
              <p className="mt-4 text-sm">{details.fullName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {details.address}, {details.city}, {details.state} {details.pincode}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {details.phone} · {details.email}
              </p>
            </div>
          )}

          <div className="rounded-md border border-border bg-card p-6 md:p-8 soft-shadow">
            <p className="text-eyebrow">Select payment method</p>
            <div className="mt-6 space-y-3">
              {PAYMENT_METHODS.map((m) => {
                const Icon = ICONS[m.id];
                const active = method === m.id;
                return (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-md border p-5 transition-colors ${active ? "border-primary" : "border-border hover:border-primary/50"}`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="method"
                        checked={active}
                        onChange={() => setMethod(m.id)}
                        className="accent-primary"
                      />
                      <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
                      <div>
                        <p className="text-sm font-medium">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.note}</p>
                      </div>
                    </div>
                    {active && <Check className="h-4 w-4 text-accent" />}
                  </label>
                );
              })}
            </div>

            <p className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Demonstration checkout — no card is charged
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary items={items} totals={totals} />

          <div className="mt-6">
            {status === "idle" && (
              <LuxeButton className="w-full" onClick={pay} arrow>
                Pay {inr(totals.total)}
              </LuxeButton>
            )}
            {status === "processing" && (
              <div className="flex items-center justify-center gap-3 rounded-full border border-border px-6 py-3.5 text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Processing payment — do not close
              </div>
            )}
            {status === "succeeded" && (
              <div className="flex items-center justify-center gap-3 rounded-full border border-accent bg-accent/10 px-6 py-3.5 text-[9px] uppercase tracking-[0.24em] text-accent">
                <Check className="h-4 w-4" /> Payment successful
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
