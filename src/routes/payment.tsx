import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { inr } from "@/lib/haston-data";
import { readCheckoutDraft, saveCheckoutDraft, type OrderDraft } from "@/lib/mock-commerce";
import { hastonApi, type RazorpayOrderResponse } from "@/lib/haston-api";
import { ApiError } from "@/lib/api-client";
import { loadRazorpayCheckout } from "@/lib/payment/razorpay-loader";
import { useHastonCart } from "@/hooks/use-haston-cart";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Payment — HASTON" },
      { name: "description", content: "Complete your HASTON order." },
    ],
  }),
  component: Payment,
});

const RAZORPAY_PUBLIC_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
type PaymentState = "idle" | "creating" | "opening" | "verifying" | "failed";

function Payment() {
  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<RazorpayOrderResponse | null>(null);
  const [error, setError] = useState("");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const { items, isLoading: cartLoading, error: cartError } = useHastonCart();
  const totalsQuery = useQuery({
    queryKey: ["haston", "checkout-validation", items.map((item) => `${item.id}:${item.quantity}`).join(",")],
    queryFn: () => hastonApi.validateCheckout(),
    enabled: items.length > 0,
  });

  useEffect(() => setDraft(readCheckoutDraft()), []);

  if (!draft) {
    return (
      <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-center">
        <div>
          <p className="text-eyebrow text-muted-foreground">Payment unavailable</p>
          <h1 className="mt-4 text-display text-4xl">Your checkout has expired.</h1>
          <p className="mt-4 text-sm text-muted-foreground">Return to checkout to begin a new order.</p>
          <LuxeButton to="/cart" className="mt-8" arrow>Return to bag</LuxeButton>
        </div>
      </section>
    );
  }

  if (cartLoading || !totalsQuery.data) {
    return <p className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-sm text-muted-foreground">Loading your payment summary...</p>;
  }
  if (cartError || items.length === 0) {
    return <p className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-sm text-destructive">Unable to load your bag. Please return to checkout.</p>;
  }

  const submitting = ["creating", "opening", "verifying"].includes(paymentState);
  const displayTotal = paymentOrder
    ? formatBackendAmount(paymentOrder.amount, paymentOrder.currency)
    : inr(totalsQuery.data.total);

  const submit = async () => {
    setError("");
    if (!RAZORPAY_PUBLIC_KEY) {
      setPaymentState("failed");
      setError("Secure payment is not configured yet. Please try again later.");
      return;
    }
    if (!draft.idempotencyKey) {
      setPaymentState("failed");
      setError("This checkout has expired. Please restart checkout.");
      return;
    }

    setPaymentState("creating");
    try {
      const order = await hastonApi.razorpayOrder({ idempotencyKey: draft.idempotencyKey });
      const nextDraft: OrderDraft = {
        ...draft,
        paymentMethod: "razorpay",
        paymentId: order.paymentId,
        razorpayOrderId: order.razorpayOrderId,
      };
      saveCheckoutDraft(nextDraft);
      setDraft(nextDraft);
      setPaymentOrder(order);

      const Razorpay = await loadRazorpayCheckout();
      setPaymentState("opening");
      let paymentOutcome: "failed" | "success" | null = null;
      const checkout = new Razorpay({
        key: RAZORPAY_PUBLIC_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "HASTON",
        description: "HASTON order payment",
        handler: async (response) => {
          if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
            setPaymentState("failed");
            setError("Payment could not be verified. Please try again.");
            return;
          }
          paymentOutcome = "success";
          setPaymentState("verifying");
          try {
            const result = await hastonApi.razorpayVerify({
              paymentId: order.paymentId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: draft.shippingAddress || {},
              billingAddress: draft.shippingAddress || {},
            });
            if (result.success && result.paymentStatus === "AUTHORIZED") {
              window.location.assign(`/order-confirmation?orderId=${result.orderId}`);
              return;
            }
            setPaymentState("failed");
            setError("Payment verification did not complete.");
          } catch (verificationError) {
            setPaymentState("failed");
            setError(getPaymentError(verificationError));
          }
        },
        modal: {
          ondismiss: () => {
            if (paymentOutcome !== null) return;
            setPaymentState("failed");
            setError("Payment was cancelled. You can try again when you are ready.");
          },
        },
        theme: { color: "#0E1A2B" },
      });
      checkout.on("payment.failed", () => {
        paymentOutcome = "failed";
        setPaymentState("failed");
        setError("Payment failed. You can try again when you are ready.");
      });
      checkout.open();
    } catch (submissionError) {
      setPaymentState("failed");
      setError(getPaymentError(submissionError));
    }
  };

  return (
    <section className="mx-auto min-h-[80vh] max-w-[1600px] px-6 py-10 md:px-10">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <Link to="/" className="text-display text-xl tracking-[0.3em]">HASTON</Link>
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground"><Lock className="h-3.5 w-3.5" /> Secure checkout</p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-eyebrow text-muted-foreground">Step 3 of 3</p>
          <h1 className="mt-3 text-display text-4xl">Complete your order.</h1>
          <div className="mt-8 rounded-md border border-border p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary"><ShieldCheck className="h-5 w-5" /></div>
              <div>
                <p className="text-sm font-medium">Pay securely with Razorpay</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Complete your payment in Razorpay Checkout. Your payment credentials are handled by Razorpay and are never entered or stored by HASTON.</p>
              </div>
            </div>
            <div className="mt-6 border-t border-border pt-5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Payment amount</span><span className="font-medium">{displayTotal}</span></div>
              <div className="mt-2 flex justify-between"><span className="text-muted-foreground">Currency</span><span>{paymentOrder?.currency || totalsQuery.data.currency}</span></div>
              {draft.shippingAddress && <div className="mt-4 border-t border-border pt-4"><p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Shipping to</p><p className="mt-2 text-sm">{draft.shippingAddress.firstName} {draft.shippingAddress.lastName}</p><p className="mt-1 text-sm text-muted-foreground">{draft.shippingAddress.address}, {draft.shippingAddress.city}, {draft.shippingAddress.postalCode}, {draft.shippingAddress.country}</p></div>}
            </div>
          </div>

          {error && <p role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
          <LuxeButton onClick={submit} disabled={submitting} className="mt-6 w-full sm:w-auto" arrow>
            {paymentState === "creating" ? "Preparing secure payment..." : paymentState === "opening" ? "Opening Razorpay..." : paymentState === "verifying" ? "Verifying securely..." : `Pay ${displayTotal}`}
          </LuxeButton>
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{paymentState === "failed" ? "Your order has not been placed. You can retry this payment attempt." : "Payment is completed only after secure backend verification."}</p>
        </div>

        <aside className="md:sticky md:top-16 md:self-start">
          <div className="rounded-md border border-border bg-card p-8 soft-shadow">
            <p className="text-eyebrow">Order summary</p>
            <div className="mt-6 space-y-5">
              {items.map((item) => <div key={item.id} className="flex gap-4"><img src={item.product.image} alt={item.product.name} className="h-24 w-20 shrink-0 rounded object-cover" /><div className="min-w-0 flex-1"><p className="text-sm">{item.product.name}</p><p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{item.variant?.color || "Selected"} · Size {item.variant?.size || "Standard"} · Qty {item.quantity}</p></div><p className="text-sm">{inr(item.lineTotal)}</p></div>)}
            </div>
            <div className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
              <SummaryRow label="Subtotal" value={inr(totalsQuery.data.subtotal)} />
              <SummaryRow label="Shipping" value={totalsQuery.data.shipping === 0 ? "Complimentary" : inr(totalsQuery.data.shipping)} />
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg"><span className="text-display">Total</span><span className="font-medium">{displayTotal}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function formatBackendAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount / 100);
}

function getPaymentError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 409) return error.message.includes("Cart total no longer matches") ? "Your cart amount changed. Please restart checkout before trying again." : "This payment attempt cannot continue. Please restart checkout and try again.";
    if (error.status === 401) return "Your session expired. Please sign in and try again.";
  }
  return "We could not complete payment. Please try again.";
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="text-foreground">{value}</span></div>;
}