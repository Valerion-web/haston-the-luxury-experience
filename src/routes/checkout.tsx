import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Truck, User } from "lucide-react";
import { inr } from "@/lib/haston-data";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { createCheckoutIdempotencyKey, saveCheckoutDraft } from "@/lib/mock-commerce";
import { useHastonCart } from "@/hooks/use-haston-cart";
import { useHastonSession } from "@/hooks/use-haston-session";
import { ApiError } from "@/lib/api-client";
import { clearSession } from "@/lib/haston-session";
import { hastonApi } from "@/lib/haston-api";
import { useQuery } from "@tanstack/react-query";
import { CouponSuggestions } from "@/components/checkout/CouponSuggestions";
import { consumeCheckoutCouponSuggestion } from "@/lib/mock-commerce";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — HASTON" },
      { name: "description", content: "Secure checkout at HASTON." },
    ],
  }),
  component: Checkout,
});

const STEPS = [
  { key: "info", label: "Information", icon: User },
  { key: "ship", label: "Shipping", icon: Truck },
];

function Checkout() {
  const session = useHastonSession();
  const navigate = useNavigate();
  const { items: cartItems, isLoading, error } = useHastonCart();
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({
    email: session?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof details, string>>>({});
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponValidationAttempt, setCouponValidationAttempt] = useState(0);
  const items = cartItems.map((item) => ({
    id: String(item.id),
    product: item.product,
    quantity: item.quantity,
    size: item.variant?.size || "Standard",
    color: item.variant?.color || "Selected",
    lineTotal: item.lineTotal,
  }));
  const cartKey = cartItems
    .map((item) =>
      JSON.stringify([
        item.id,
        item.product.backendId ?? item.product.id,
        item.product.category,
        item.variant?.id ?? null,
        item.quantity,
        item.unitPrice,
        item.lineTotal,
      ]),
    )
    .sort()
    .join(",");
  const checkoutEnabled = Boolean(session) && !isLoading && !error && items.length > 0;
  const totalsQuery = useQuery({
    queryKey: ["haston", "checkout-validation", cartKey],
    queryFn: () => hastonApi.validateCheckout(),
    enabled: checkoutEnabled,
    refetchOnMount: "always",
  });
  const couponTotalsQuery = useQuery({
    queryKey: ["haston", "checkout-validation", cartKey, "coupon", appliedCouponCode, couponValidationAttempt],
    queryFn: () => hastonApi.validateCheckout(appliedCouponCode || undefined),
    enabled: checkoutEnabled && Boolean(appliedCouponCode),
    refetchOnMount: "always",
  });
  const baseTotals =
    totalsQuery.isSuccess && !totalsQuery.isFetching ? totalsQuery.data : undefined;
  const couponTotals =
    couponTotalsQuery.isSuccess && !couponTotalsQuery.isFetching
      ? couponTotalsQuery.data
      : undefined;
  const totals = appliedCouponCode ? couponTotals || baseTotals : baseTotals;
  const isApplyingCoupon = Boolean(appliedCouponCode) && couponTotalsQuery.isFetching;
  const isSameCouponPending =
    isApplyingCoupon &&
    couponInput.trim().toUpperCase() === appliedCouponCode?.trim().toUpperCase();
  const couponInputNeedsApply =
    Boolean(couponInput.trim()) &&
    couponInput.trim().toUpperCase() !== appliedCouponCode?.trim().toUpperCase();
  const couponNeedsValidation = Boolean(appliedCouponCode) && !couponTotals;
  const cannotContinueToPayment = couponInputNeedsApply || couponNeedsValidation;
  const couponErrorMessage =
    couponTotalsQuery.error instanceof ApiError &&
    [400, 404, 422].includes(couponTotalsQuery.error.status)
      ? "That coupon code is invalid or unavailable."
      : "We couldn't validate this code. Please check your connection and try again.";

  const applyCouponCode = (couponCode: string) => {
    const trimmedCode = couponCode.trim();
    if (!trimmedCode) return;
    setCouponInput(trimmedCode);
    setAppliedCouponCode(trimmedCode);
    setCouponValidationAttempt((attempt) => attempt + 1);
  };

  useEffect(() => {
    if (!session) {
      void navigate({ to: "/login", replace: true });
      return;
    }
    setDetails((current) => ({ ...current, email: current.email || session.email }));
  }, [navigate, session]);

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      clearSession();
      void navigate({ to: "/login", replace: true });
    }
  }, [error, navigate]);

  useEffect(() => {
    const suggestedCode = consumeCheckoutCouponSuggestion();
    if (!suggestedCode) return;
    setCouponInput(suggestedCode);
    setAppliedCouponCode(suggestedCode);
    setCouponValidationAttempt((attempt) => attempt + 1);
  }, []);

  if (!session) return null;
  if (isLoading) {
    return <p className="mx-auto min-h-[70vh] max-w-2xl px-6 py-16 text-center text-sm text-muted-foreground">Loading your checkout...</p>;
  }
  if (error) {
    return <p role="alert" className="mx-auto min-h-[70vh] max-w-2xl px-6 py-16 text-center text-sm text-destructive">Unable to load your bag. Please return to your cart and try again.</p>;
  }
  if (cartItems.length === 0) {
    return (
      <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-center">
        <div>
          <p className="text-eyebrow text-muted-foreground">Checkout unavailable</p>
          <h1 className="mt-4 text-display text-4xl">Your bag is empty.</h1>
          <LuxeButton to="/collections" className="mt-8" arrow>
            Continue shopping
          </LuxeButton>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-[80vh] max-w-[1600px] px-6 py-10 md:px-10">
      <Link to="/" className="text-display text-xl tracking-[0.3em]">
        HASTON
      </Link>

      <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_440px]">
        <div>
          {/* Progress */}
          <div className="mb-6 flex items-center gap-4">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex flex-1 items-center gap-3">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-full border transition-all ${i <= step ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span
                  className={`hidden text-[11px] uppercase tracking-[0.28em] md:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className={`ml-2 h-px flex-1 transition-colors ${i < step ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {step === 0 && (
                <>
                  <h2 className="text-display text-3xl">Contact & delivery</h2>
                  <Field
                    label="Email"
                    placeholder="your@email.com"
                    value={details.email}
                    error={errors.email}
                    onChange={(value) => setDetails({ ...details, email: value })}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="First name"
                      value={details.firstName}
                      error={errors.firstName}
                      onChange={(value) => setDetails({ ...details, firstName: value })}
                    />
                    <Field
                      label="Last name"
                      value={details.lastName}
                      error={errors.lastName}
                      onChange={(value) => setDetails({ ...details, lastName: value })}
                    />
                  </div>
                  <Field
                    label="Address"
                    value={details.address}
                    error={errors.address}
                    onChange={(value) => setDetails({ ...details, address: value })}
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field
                      label="City"
                      value={details.city}
                      error={errors.city}
                      onChange={(value) => setDetails({ ...details, city: value })}
                    />
                    <Field
                      label="Postal code"
                      value={details.postalCode}
                      error={errors.postalCode}
                      onChange={(value) => setDetails({ ...details, postalCode: value })}
                    />
                    <Field
                      label="Country"
                      value={details.country}
                      error={errors.country}
                      onChange={(value) => setDetails({ ...details, country: value })}
                    />
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <h2 className="text-display text-3xl">Shipping method</h2>
                  {[
                    { title: "Standard", body: "5–7 business days", price: "Complimentary" },
                    { title: "Express", body: "2–3 business days", price: inr(18) },
                    { title: "White-glove", body: "Next-day, hand-delivered", price: inr(45) },
                  ].map((s, i) => (
                    <label
                      key={i}
                      className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-border p-5 transition-colors hover:border-primary"
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="ship"
                          defaultChecked={i === 0}
                          className="accent-primary"
                        />
                        <div>
                          <p className="text-sm font-medium">{s.title}</p>
                          <p className="text-xs text-muted-foreground">{s.body}</p>
                        </div>
                      </div>
                      <span className="text-sm">{s.price}</span>
                    </label>
                  ))}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground disabled:opacity-30"
            >
              ← Back
            </button>
            {step < 1 ? (
              <LuxeButton
                onClick={() => {
                  const nextErrors = validateDetails(details);
                  setErrors(nextErrors);
                  if (Object.keys(nextErrors).length === 0) setStep(1);
                }}
                arrow
              >
                Continue
              </LuxeButton>
            ) : (
              <LuxeButton
                onClick={() => {
                  const nextErrors = validateDetails(details);
                  setErrors(nextErrors);
                  if (Object.keys(nextErrors).length > 0 || cannotContinueToPayment) return;
                  saveCheckoutDraft({
                    idempotencyKey: createCheckoutIdempotencyKey(),
                    paymentMethod: "razorpay",
                    shippingAddress: details,
                    ...(couponTotals && appliedCouponCode
                      ? { couponCode: appliedCouponCode.trim() }
                      : {}),
                  });
                  window.location.assign("/payment");
                }}
                disabled={cannotContinueToPayment}
                arrow
              >
                Continue to payment
              </LuxeButton>
            )}
          </div>
        </div>

        <aside className="md:sticky md:top-16 md:self-start">
          <div className="rounded-md border border-border bg-card p-8 soft-shadow">
            <p className="text-eyebrow">Order summary</p>
            <div className="mt-6 space-y-4">
              {items.map(({ product, quantity, color, size, lineTotal }) => (
                <div key={product.id} className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-16 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{product.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      {color} · Size {size} · Qty {quantity}
                    </p>
                  </div>
                  <p className="text-sm">{inr(lineTotal)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-y border-border py-5">
              <p className="text-eyebrow">Coupon code</p>
              <form
                className="mt-3 flex flex-wrap gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  applyCouponCode(couponInput);
                }}
              >
                <input
                  aria-label="Coupon code"
                  autoComplete="off"
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value)}
                  placeholder="Enter code"
                  className="min-w-0 flex-1 rounded-md border border-border bg-transparent px-3 py-2 text-sm uppercase placeholder:normal-case focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!couponInput.trim() || isSameCouponPending}
                  className="rounded-md border border-primary px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSameCouponPending ? "Checking..." : "Apply"}
                </button>
                {appliedCouponCode && (
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCouponCode(null);
                      setCouponInput("");
                      void totalsQuery.refetch();
                    }}
                    className="px-2 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Remove
                  </button>
                )}
              </form>
              {isApplyingCoupon && (
                <p role="status" className="mt-3 text-xs text-muted-foreground">
                  Checking coupon...
                </p>
              )}
              {!isApplyingCoupon && appliedCouponCode && couponTotals && (
                <p role="status" className="mt-3 text-xs text-emerald-700">
                  Coupon {appliedCouponCode} applied.
                </p>
              )}
              {!isApplyingCoupon && appliedCouponCode && couponTotalsQuery.isError && (
                <p role="alert" className="mt-3 text-xs text-destructive">
                  {couponErrorMessage}
                </p>
              )}
              {couponInputNeedsApply && (
                <p role="status" className="mt-3 text-xs text-muted-foreground">
                  Apply this code or clear it before continuing.
                </p>
              )}
            </div>
            <CouponSuggestions
              cartKey={cartKey}
              userId={session.id}
              appliedCode={couponTotals ? appliedCouponCode : null}
              applyingCode={isApplyingCoupon ? appliedCouponCode : null}
              onApply={applyCouponCode}
            />
            <div className="mt-6 hairline pt-6 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                    <span className="text-foreground">{totals ? inr(totals.subtotal) : "Calculating..."}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Discount</span>
                <span className="text-foreground">
                  {totals
                    ? totals.discount > 0
                      ? `-${inr(totals.discount)}`
                      : inr(totals.discount)
                    : "Calculating..."}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-foreground">
                    {totals ? (totals.shipping === 0 ? "Complimentary" : inr(totals.shipping)) : "Calculating..."}
                </span>
              </div>
              <div className="mt-3 flex justify-between hairline pt-3 text-lg">
                <span className="text-display">Total</span>
                <span className="font-medium">{totals ? inr(totals.total) : "Calculating..."}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  value,
  error,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        placeholder={placeholder}
        className={`mt-2 block w-full rounded-md border bg-transparent px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none ${error ? "border-destructive" : "border-border"}`}
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function validateDetails(details: Record<string, string>) {
  const errors: Partial<Record<keyof typeof details, string>> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!details.firstName.trim()) errors.firstName = "First name is required.";
  if (!details.lastName.trim()) errors.lastName = "Last name is required.";
  if (!details.address.trim()) errors.address = "Address is required.";
  if (!details.city.trim()) errors.city = "City is required.";
  if (!/^\d{5,6}(-\d{4})?$/.test(details.postalCode.trim()))
    errors.postalCode = "Enter a valid postal code.";
  if (!details.country.trim()) errors.country = "Country is required.";
  return errors;
}
