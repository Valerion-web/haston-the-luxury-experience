import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Truck, User, Lock } from "lucide-react";
import { PRODUCTS } from "@/lib/haston-data";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — HASTON" }, { name: "description", content: "Secure checkout at HASTON." }] }),
  component: Checkout,
});

const STEPS = [
  { key: "info", label: "Information", icon: User },
  { key: "ship", label: "Shipping", icon: Truck },
  { key: "pay", label: "Payment", icon: CreditCard },
];

function Checkout() {
  const [step, setStep] = useState(0);
  const items = [PRODUCTS[0], PRODUCTS[2]];
  const total = items.reduce((s, p) => s + p.price, 0);

  return (
    <section className="mx-auto min-h-[80vh] max-w-[1600px] px-6 py-16 md:px-10">
      <Link to="/" className="text-display text-xl tracking-[0.3em]">HASTON</Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_440px]">
        <div>
          {/* Progress */}
          <div className="mb-12 flex items-center gap-4">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex flex-1 items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-full border transition-all ${i <= step ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                  {i < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className={`hidden text-[11px] uppercase tracking-[0.28em] md:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                {i < STEPS.length - 1 && <div className={`ml-2 h-px flex-1 transition-colors ${i < step ? "bg-primary" : "bg-border"}`} />}
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
                  <Field label="Email" placeholder="your@email.com" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name" />
                    <Field label="Last name" />
                  </div>
                  <Field label="Address" />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="City" />
                    <Field label="Postal code" />
                    <Field label="Country" />
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <h2 className="text-display text-3xl">Shipping method</h2>
                  {[
                    { title: "Standard", body: "5–7 business days", price: "Complimentary" },
                    { title: "Express", body: "2–3 business days", price: "$18" },
                    { title: "White-glove", body: "Next-day, hand-delivered", price: "$45" },
                  ].map((s, i) => (
                    <label key={i} className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-border p-5 transition-colors hover:border-primary">
                      <div className="flex items-center gap-4">
                        <input type="radio" name="ship" defaultChecked={i === 0} className="accent-primary" />
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
              {step === 2 && (
                <>
                  <h2 className="text-display text-3xl">Payment</h2>
                  <Field label="Card number" placeholder="1234 5678 9012 3456" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Expiration" placeholder="MM / YY" />
                    <Field label="CVC" placeholder="123" />
                  </div>
                  <Field label="Name on card" />
                  <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" /> Encrypted with 256-bit SSL
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
              className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground disabled:opacity-30">
              ← Back
            </button>
            {step < 2 ? (
              <LuxeButton onClick={() => setStep(step + 1)} arrow>Continue</LuxeButton>
            ) : (
              <LuxeButton onClick={() => alert("Order placed")} arrow>Place order — ${total}</LuxeButton>
            )}
          </div>
        </div>

        <aside className="md:sticky md:top-16 md:self-start">
          <div className="rounded-md border border-border bg-card p-8 soft-shadow">
            <p className="text-eyebrow">Order summary</p>
            <div className="mt-6 space-y-4">
              {items.map(p => (
                <div key={p.id} className="flex gap-4">
                  <img src={p.image} alt={p.name} className="h-20 w-16 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{p.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Qty 1</p>
                  </div>
                  <p className="text-sm">${p.price}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 hairline pt-6 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="text-foreground">${total}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="text-foreground">Complimentary</span></div>
              <div className="mt-3 flex justify-between hairline pt-3 text-lg"><span className="text-display">Total</span><span className="font-medium">${total}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
      <input placeholder={placeholder}
        className="mt-2 block w-full rounded-md border border-border bg-transparent px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none" />
    </label>
  );
}
