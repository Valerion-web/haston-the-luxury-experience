import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Truck, User } from "lucide-react";
import { PRODUCTS, inr } from "@/lib/haston-data";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { saveCheckoutDraft } from "@/lib/mock-commerce";

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
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof details, string>>>({});
  const items = [
    { product: PRODUCTS[0], quantity: 1, size: "M", color: "Navy" },
    { product: PRODUCTS[2], quantity: 2, size: "L", color: "Olive" },
  ];
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 180 ? 0 : 12;
  const total = subtotal + shipping;

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
                  if (Object.keys(nextErrors).length > 0) return;
                  saveCheckoutDraft({
                    items,
                    subtotal,
                    shipping,
                    total,
                    paymentMethod: "upi",
                    shippingAddress: details,
                  });
                  window.location.assign("/payment");
                }}
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
              {items.map(({ product, quantity, color, size }) => (
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
                  <p className="text-sm">{inr(product.price * quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 hairline pt-6 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">{inr(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-foreground">
                  {shipping === 0 ? "Complimentary" : inr(shipping)}
                </span>
              </div>
              <div className="mt-3 flex justify-between hairline pt-3 text-lg">
                <span className="text-display">Total</span>
                <span className="font-medium">{inr(total)}</span>
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
