import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { inr } from "@/lib/haston-data";
import {
  createPaymentAttemptKey,
  readCheckoutDraft,
  saveCheckoutCouponSuggestion,
  saveCheckoutDraft,
  type OrderDraft,
} from "@/lib/mock-commerce";
import { hastonApi, type CartItem, type RazorpayOrderResponse } from "@/lib/haston-api";
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

const cartFingerprintFor = (items: CartItem[]) =>
  JSON.stringify(
    items
      .map((item) => [
        item.id,
        item.product.backendId ?? item.product.id,
        item.product.category,
        item.variant?.id ?? null,
        item.quantity,
        item.unitPrice,
        item.lineTotal,
      ])
      .sort((left, right) => String(left[0]).localeCompare(String(right[0]))),
  );

function Payment() {
  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<RazorpayOrderResponse | null>(null);
  const [reviewedTotalInPaise, setReviewedTotalInPaise] = useState<number | null>(null);
  const [confirmedAmountInPaise, setConfirmedAmountInPaise] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [paymentActionInProgress, setPaymentActionInProgress] = useState(false);
  const paymentActionLocked = useRef(false);
  const navigate = useNavigate();
  const { items, isLoading: cartLoading, error: cartError, refetch: refetchCart } = useHastonCart();
  const cartKey = cartFingerprintFor(items);
  const invalidCouponDraft =
    draft !== null &&
    draft.couponCode !== undefined &&
    (typeof draft.couponCode !== "string" || !draft.couponCode.trim());
  const couponCode =
    typeof draft?.couponCode === "string" ? draft.couponCode.trim() : undefined;
  const totalsQuery = useQuery({
    queryKey: ["haston", "checkout-validation", cartKey, couponCode || null],
    queryFn: () => hastonApi.validateCheckout(couponCode),
    enabled: Boolean(draft) && !invalidCouponDraft && !draft?.paymentRecoveryState && items.length > 0,
  });

  useEffect(() => setDraft(readCheckoutDraft()), []);

  const releasePaymentAction = () => {
    paymentActionLocked.current = false;
    setPaymentActionInProgress(false);
  };

  const requireRecovery = (
    recoveryState: NonNullable<OrderDraft["paymentRecoveryState"]>,
    sourceDraft: OrderDraft | null = draft,
  ) => {
    if (!sourceDraft) return;
    const recoveryDraft: OrderDraft = { ...sourceDraft, paymentRecoveryState: recoveryState };
    saveCheckoutDraft(recoveryDraft);
    setDraft(recoveryDraft);
    setPaymentOrder(null);
    setConfirmedAmountInPaise(null);
    setPaymentState("failed");
    setError("");
    releasePaymentAction();
  };

  const returnToCheckout = () => {
    if (!draft) return;
    if (draft.couponCode?.trim()) saveCheckoutCouponSuggestion(draft.couponCode.trim());
    void navigate({ to: "/checkout" });
  };

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

  if (draft.paymentRecoveryState === "verification_unresolved") {
    return (
      <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-center">
        <div>
          <p className="text-eyebrow text-muted-foreground">Payment status unresolved</p>
          <h1 className="mt-4 text-display text-4xl">Please don't retry this payment.</h1>
          <p role="alert" className="mt-4 text-sm text-muted-foreground">
            We couldn't confirm the payment result. Contact support before starting another payment.
          </p>
          {draft.paymentId && <p className="mt-3 text-xs text-muted-foreground">Payment reference: {draft.paymentId}</p>}
          <LuxeButton to="/support" className="mt-8" arrow>Contact support</LuxeButton>
        </div>
      </section>
    );
  }

  if (draft.paymentRecoveryState) {
    return (
      <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-center">
        <div>
          <p className="text-eyebrow text-muted-foreground">Checkout needs review</p>
          <h1 className="mt-4 text-display text-4xl">Your bag or payment attempt changed.</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Return to checkout to review your bag and start a fresh payment attempt.
          </p>
          <LuxeButton onClick={returnToCheckout} className="mt-8" arrow>Return to checkout</LuxeButton>
        </div>
      </section>
    );
  }

  if (invalidCouponDraft) {
    return (
      <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-center">
        <div>
          <p className="text-eyebrow text-muted-foreground">Payment unavailable</p>
          <h1 className="mt-4 text-display text-4xl">Your coupon details need review.</h1>
          <p role="alert" className="mt-4 text-sm text-muted-foreground">
            Return to checkout and reapply the coupon before continuing to payment.
          </p>
          <LuxeButton to="/checkout" className="mt-8" arrow>Return to checkout</LuxeButton>
        </div>
      </section>
    );
  }

  if (cartLoading) {
    return <p className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-sm text-muted-foreground">Loading your payment summary...</p>;
  }
  if (cartError || items.length === 0) {
    return <p className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-sm text-destructive">Unable to load your bag. Please return to checkout.</p>;
  }
  const paymentOrderCartMismatch =
    paymentOrder !== null &&
    (!draft.paymentCartFingerprint || cartKey !== draft.paymentCartFingerprint);
  if (paymentOrderCartMismatch) {
    return (
      <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-center">
        <div>
          <p className="text-eyebrow text-muted-foreground">Payment unavailable</p>
          <h1 className="mt-4 text-display text-4xl">Cart changed — return to checkout.</h1>
          <p role="alert" className="mt-4 text-sm text-muted-foreground">
            Your cached payment order is no longer matched to the current bag. Review your cart and start a fresh checkout.
          </p>
          <LuxeButton
            onClick={() => {
              requireRecovery("restart_checkout", draft);
              returnToCheckout();
            }}
            className="mt-8"
            arrow
          >
            Return to checkout
          </LuxeButton>
        </div>
      </section>
    );
  }
  if (totalsQuery.isError) {
    return (
      <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-center">
        <div>
          <p className="text-eyebrow text-muted-foreground">Payment unavailable</p>
          <h1 className="mt-4 text-display text-4xl">We couldn't confirm your checkout total.</h1>
          <p role="alert" className="mt-4 text-sm text-muted-foreground">
            Return to checkout to review the coupon and total before paying.
          </p>
          <LuxeButton to="/checkout" className="mt-8" arrow>Return to checkout</LuxeButton>
        </div>
      </section>
    );
  }
  if (totalsQuery.isFetching || !totalsQuery.data) {
    return <p className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-sm text-muted-foreground">Loading your payment summary...</p>;
  }

  const submitting = ["creating", "opening", "verifying"].includes(paymentState);
  const displayTotal = paymentOrder
    ? formatBackendAmount(paymentOrder.amount, paymentOrder.currency)
    : inr(totalsQuery.data.total);
  const amountChanged =
    paymentOrder !== null &&
    reviewedTotalInPaise !== null &&
    paymentOrder.amount !== reviewedTotalInPaise;
  const amountConfirmationRequired =
    amountChanged && confirmedAmountInPaise !== paymentOrder?.amount;

  const submit = async (confirmAmountInPaise: number | null = null) => {
    if (paymentActionLocked.current) return;
    paymentActionLocked.current = true;
    setPaymentActionInProgress(true);
    setError("");
    if (!RAZORPAY_PUBLIC_KEY) {
      setPaymentState("failed");
      setError("Secure payment is not configured yet. Please try again later.");
      releasePaymentAction();
      return;
    }
    if (!draft.idempotencyKey) {
      setPaymentState("failed");
      setError("This checkout has expired. Please restart checkout.");
      releasePaymentAction();
      return;
    }
    if (totalsQuery.isFetching || !totalsQuery.data) {
      setPaymentState("failed");
      setError("Your checkout total is still being confirmed. Please wait and try again.");
      releasePaymentAction();
      return;
    }

    let activeDraft: OrderDraft = draft;
    try {
      const reviewedAmount = reviewedTotalInPaise ?? Math.round(totalsQuery.data.total * 100);
      if (reviewedTotalInPaise === null) setReviewedTotalInPaise(reviewedAmount);
      setPaymentState("creating");

      const cartBeforeOrder = await refetchCart();
      if (cartBeforeOrder.error || !cartBeforeOrder.data) {
        throw cartBeforeOrder.error || new Error("Unable to confirm your current bag.");
      }
      const requestCartFingerprint = cartFingerprintFor(cartBeforeOrder.data.items);
      if (
        requestCartFingerprint !== cartKey ||
        (activeDraft.paymentCartFingerprint && requestCartFingerprint !== activeDraft.paymentCartFingerprint)
      ) {
        requireRecovery("restart_checkout", activeDraft);
        return;
      }

      const paymentAttemptKey =
        activeDraft.paymentAttemptKey || createPaymentAttemptKey(activeDraft.idempotencyKey);
      const shouldPersistAttempt =
        !activeDraft.paymentAttemptKey || !activeDraft.paymentCartFingerprint;
      const attemptDraft: OrderDraft = {
        ...activeDraft,
        paymentAttemptKey,
        paymentCartFingerprint: activeDraft.paymentCartFingerprint || requestCartFingerprint,
      };
      activeDraft = attemptDraft;
      if (shouldPersistAttempt) {
        saveCheckoutDraft(attemptDraft);
        setDraft(attemptDraft);
      }

      const order: RazorpayOrderResponse = await hastonApi.razorpayOrder({
        idempotencyKey: activeDraft.idempotencyKey,
        paymentAttemptKey,
        ...(couponCode ? { couponCode } : {}),
      });
      const nextDraft: OrderDraft = {
        ...attemptDraft,
        paymentMethod: "razorpay",
        paymentId: order.paymentId,
        razorpayOrderId: order.razorpayOrderId,
      };
      activeDraft = nextDraft;
      saveCheckoutDraft(nextDraft);
      setDraft(nextDraft);
      setPaymentOrder(order);

      const cartAfterOrder = await refetchCart();
      if (cartAfterOrder.error || !cartAfterOrder.data) {
        throw cartAfterOrder.error || new Error("Unable to confirm your current bag.");
      }
      if (cartFingerprintFor(cartAfterOrder.data.items) !== requestCartFingerprint) {
        requireRecovery("restart_checkout", activeDraft);
        return;
      }

      if (
        order.amount !== reviewedAmount &&
        order.amount !== confirmAmountInPaise &&
        order.amount !== confirmedAmountInPaise
      ) {
        setConfirmedAmountInPaise(null);
        setPaymentState("idle");
        releasePaymentAction();
        return;
      }
      if (order.amount !== reviewedAmount) setConfirmedAmountInPaise(order.amount);

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
            requireRecovery("verification_unresolved", activeDraft);
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
              shippingAddress: activeDraft.shippingAddress || {},
              billingAddress: activeDraft.shippingAddress || {},
            });
            if (result.success && result.paymentStatus === "AUTHORIZED") {
              window.location.assign(`/order-confirmation?orderId=${result.orderId}`);
              return;
            }
            requireRecovery("verification_unresolved", activeDraft);
          } catch {
            requireRecovery("verification_unresolved", activeDraft);
          }
        },
        modal: {
          ondismiss: () => {
            if (paymentOutcome === "success") return;
            if (paymentOutcome === null) {
              setPaymentState("failed");
              setError("Payment was cancelled. We will recheck this attempt before any retry.");
            }
            releasePaymentAction();
          },
        },
        theme: { color: "#0E1A2B" },
      });
      checkout.on("payment.failed", () => {
        paymentOutcome = "failed";
        setPaymentState("failed");
        setError("Payment failed. Close Razorpay to recheck this attempt before retrying.");
      });

      const cartBeforeOpen = await refetchCart();
      if (cartBeforeOpen.error || !cartBeforeOpen.data) {
        requireRecovery("restart_checkout", activeDraft);
        return;
      }
      const latestCartFingerprint = cartFingerprintFor(cartBeforeOpen.data.items);
      if (
        latestCartFingerprint !== requestCartFingerprint ||
        latestCartFingerprint !== activeDraft.paymentCartFingerprint
      ) {
        requireRecovery("restart_checkout", activeDraft);
        return;
      }

      setPaymentState("opening");
      checkout.open();
    } catch (submissionError) {
      if (submissionError instanceof ApiError && submissionError.status === 409) {
        requireRecovery("restart_checkout", activeDraft);
      } else {
        setPaymentState("failed");
        setError(getPaymentError(submissionError));
      }
      releasePaymentAction();
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

          {amountChanged && (
            <div role="alert" className="mt-4 rounded-md border border-primary/30 bg-secondary/30 p-4">
              <p className="text-sm font-medium">Your payable amount changed.</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Previously reviewed: {formatBackendAmount(reviewedTotalInPaise ?? 0, paymentOrder.currency)}
              </p>
              <p className="mt-1 text-sm font-medium">
                Authoritative payable amount: {displayTotal}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {amountConfirmationRequired
                  ? "Confirm this updated amount before opening Razorpay."
                  : "Continuing with the confirmed server-created order."}
              </p>
            </div>
          )}
          {error && <p role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
          <LuxeButton
            onClick={() => void submit(amountConfirmationRequired ? paymentOrder?.amount ?? null : null)}
            disabled={submitting || paymentActionInProgress}
            className="mt-6 w-full sm:w-auto"
            arrow
          >
            {paymentState === "creating"
              ? "Preparing secure payment..."
              : paymentState === "opening"
                ? "Opening Razorpay..."
                : paymentState === "verifying"
                  ? "Verifying securely..."
                  : amountConfirmationRequired
                    ? `Confirm updated total ${displayTotal}`
                    : `Pay ${displayTotal}`}
          </LuxeButton>
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{paymentState === "failed" ? "Your order has not been placed. You can retry this payment attempt." : "Payment is completed only after secure backend verification."}</p>
        </div>

        <aside className="md:sticky md:top-16 md:self-start">
          <div className="rounded-md border border-border bg-card p-8 soft-shadow">
            <p className="text-eyebrow">Order summary</p>
            {amountChanged ? (
              <div className="mt-6 border-t border-border pt-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Authoritative payable amount
                </p>
                <p className="mt-2 text-display text-2xl">{displayTotal}</p>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  The updated order response does not include a refreshed subtotal, discount, or shipping breakdown. The previous breakdown is hidden to avoid showing stale values.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-6 space-y-5">
                  {items.map((item) => <div key={item.id} className="flex gap-4"><img src={item.product.image} alt={item.product.name} className="h-24 w-20 shrink-0 rounded object-cover" /><div className="min-w-0 flex-1"><p className="text-sm">{item.product.name}</p><p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{item.variant?.color || "Selected"} · Size {item.variant?.size || "Standard"} · Qty {item.quantity}</p></div><p className="text-sm">{inr(item.lineTotal)}</p></div>)}
                </div>
                <div className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
                  <SummaryRow label="Subtotal" value={inr(totalsQuery.data.subtotal)} />
                  <SummaryRow label="Shipping" value={totalsQuery.data.shipping === 0 ? "Complimentary" : inr(totalsQuery.data.shipping)} />
                  <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg"><span className="text-display">Total</span><span className="font-medium">{displayTotal}</span></div>
                </div>
              </>
            )}
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