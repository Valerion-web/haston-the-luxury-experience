import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { inr } from "@/lib/haston-data";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import {
  EMPTY_DETAILS,
  INDIAN_STATES,
  getCheckoutItems,
  getDetails,
  getTotals,
  saveDetails,
  validateDetails,
  type CheckoutDetails,
  type DetailErrors,
} from "@/lib/checkout";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — HASTON" },
      { name: "description", content: "Secure checkout at HASTON." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const navigate = useNavigate();
  const items = useMemo(() => getCheckoutItems(), []);
  const totals = useMemo(() => getTotals(items), [items]);
  const [form, setForm] = useState<CheckoutDetails>(() => getDetails() ?? EMPTY_DETAILS);
  const [errors, setErrors] = useState<DetailErrors>({});

  const set = (k: keyof CheckoutDetails) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateDetails(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    saveDetails(form);
    // No order is created here — the order exists only after payment succeeds.
    navigate({ to: "/payment" });
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-10 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow">Step 1 of 2 — Details</p>
          <h1 className="text-display mt-2 text-3xl md:text-4xl">Checkout</h1>
        </div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to bag
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="grid place-items-center py-16 text-center">
          <p className="text-display text-2xl">Your bag is empty.</p>
          <LuxeButton to="/collections" className="mt-8" arrow>
            Continue shopping
          </LuxeButton>
        </div>
      ) : (
        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_440px]">
          <form onSubmit={submit} noValidate className="space-y-6">
            <div className="rounded-md border border-border bg-card p-6 md:p-8 soft-shadow">
              <p className="text-eyebrow">Contact</p>
              <div className="mt-6 space-y-5">
                <Field
                  label="Full name"
                  value={form.fullName}
                  onChange={set("fullName")}
                  error={errors.fullName}
                  autoComplete="name"
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={set("email")}
                    error={errors.email}
                    autoComplete="email"
                  />
                  <Field
                    label="Phone number"
                    type="tel"
                    placeholder="98765 43210"
                    value={form.phone}
                    onChange={set("phone")}
                    error={errors.phone}
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border bg-card p-6 md:p-8 soft-shadow">
              <p className="text-eyebrow">Delivery address</p>
              <div className="mt-6 space-y-5">
                <Field
                  label="Address"
                  placeholder="House / flat, street, area"
                  value={form.address}
                  onChange={set("address")}
                  error={errors.address}
                  autoComplete="street-address"
                />
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field
                    label="City"
                    value={form.city}
                    onChange={set("city")}
                    error={errors.city}
                    autoComplete="address-level2"
                  />
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      State
                    </span>
                    <select
                      value={form.state}
                      onChange={(e) => set("state")(e.target.value)}
                      className={`mt-2 block w-full rounded-md border bg-transparent px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none ${errors.state ? "border-destructive" : "border-border"}`}
                    >
                      <option value="">Select</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <span className="mt-1.5 block text-[10px] uppercase tracking-[0.2em] text-destructive">
                        {errors.state}
                      </span>
                    )}
                  </label>
                  <Field
                    label="Pincode"
                    inputMode="numeric"
                    value={form.pincode}
                    onChange={(v) => set("pincode")(v.replace(/\D/g, "").slice(0, 6))}
                    error={errors.pincode}
                    autoComplete="postal-code"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <ShieldCheck className="h-4 w-4" /> Details are used only for this delivery
              </p>
              <LuxeButton type="submit" onClick={() => {}} arrow>
                Continue to payment
              </LuxeButton>
            </div>
          </form>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary items={items} totals={totals} />
            <p className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> You will not be charged {inr(totals.total)} until
              payment
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  inputMode?: "numeric" | "text" | "tel";
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 block w-full rounded-md border bg-transparent px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none ${error ? "border-destructive" : "border-border"}`}
      />
      {error && (
        <span className="mt-1.5 block text-[10px] uppercase tracking-[0.2em] text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}
