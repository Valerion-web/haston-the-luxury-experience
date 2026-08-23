import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import { inr } from "@/lib/haston-data";
import {
  createMockOrder,
  mockPaymentGateway,
  readCheckoutDraft,
  saveCheckoutDraft,
  type OrderDraft,
  type PaymentMethod,
} from "@/lib/mock-commerce";
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

const METHODS: { key: PaymentMethod; label: string; detail: string }[] = [
  { key: "upi", label: "UPI", detail: "Pay with any UPI app" },
  { key: "card", label: "Credit / Debit Card", detail: "Visa, Mastercard, RuPay" },
  { key: "netbanking", label: "Net Banking", detail: "All major banks" },
  { key: "wallet", label: "Wallet", detail: "Use your preferred wallet" },
  { key: "cod", label: "Cash on Delivery", detail: "Pay when your order arrives" },
];

const inputClass =
  "mt-2 block w-full rounded-md border border-border bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none";

function Payment() {
  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [upi, setUpi] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [bank, setBank] = useState("");
  const [wallet, setWallet] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDraft(readCheckoutDraft());
  }, []);

  if (!draft) {
    return (
      <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-6 py-16 text-center">
        <div>
          <p className="text-eyebrow text-muted-foreground">Payment unavailable</p>
          <h1 className="mt-4 text-display text-4xl">Your bag is empty.</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Return to checkout to begin a new order.
          </p>
          <LuxeButton to="/cart" className="mt-8" arrow>
            Return to bag
          </LuxeButton>
        </div>
      </section>
    );
  }

  const submit = async () => {
    setError("");
    const validation = validate(method, { upi, card, bank, wallet });
    if (validation) {
      setError(validation);
      return;
    }

    setSubmitting(true);
    try {
      saveCheckoutDraft({ ...draft, paymentMethod: method });
      if (method !== "cod") {
        const result = await mockPaymentGateway(method, { upi, card, bank, wallet });
        if (!result.success)
          throw new Error("The mock payment was declined. Check your details and try again.");
      }
      await createMockOrder({ ...draft, paymentMethod: method });
      window.location.assign("/order-confirmation");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not complete your order.",
      );
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto min-h-[80vh] max-w-[1600px] px-6 py-10 md:px-10">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <Link to="/" className="text-display text-xl tracking-[0.3em]">
          HASTON
        </Link>
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <Lock className="h-3.5 w-3.5" /> Secure checkout
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-eyebrow text-muted-foreground">Step 3 of 3</p>
          <h1 className="mt-3 text-display text-4xl">Complete your order.</h1>
          <div className="mt-8 space-y-3">
            {METHODS.map((item) => (
              <label
                key={item.key}
                className={`flex cursor-pointer items-center gap-4 rounded-md border p-5 transition-colors ${method === item.key ? "border-primary bg-muted/30" : "border-border hover:border-primary/60"}`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={item.key}
                  checked={method === item.key}
                  onChange={() => {
                    setMethod(item.key);
                    setError("");
                  }}
                  className="accent-primary"
                />
                <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary">
                  {item.key === "upi" && <Smartphone className="h-4 w-4" />}
                  {item.key === "card" && <CreditCard className="h-4 w-4" />}
                  {item.key === "netbanking" && <span className="text-xs">₹</span>}
                  {item.key === "wallet" && <Wallet className="h-4 w-4" />}
                  {item.key === "cod" && <ShieldCheck className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${method === item.key ? "rotate-180" : ""}`}
                />
              </label>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 rounded-md border border-border p-6"
            >
              {method === "upi" && (
                <Field label="UPI ID" placeholder="name@bank" value={upi} onChange={setUpi} />
              )}
              {method === "card" && (
                <div className="space-y-4">
                  <Field
                    label="Card number"
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={(value) => setCard({ ...card, number: value })}
                  />
                  <Field
                    label="Name on card"
                    value={card.name}
                    onChange={(value) => setCard({ ...card, name: value })}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Expiry date"
                      placeholder="MM / YY"
                      value={card.expiry}
                      onChange={(value) => setCard({ ...card, expiry: value })}
                    />
                    <Field
                      label="CVV"
                      placeholder="123"
                      type="password"
                      value={card.cvv}
                      onChange={(value) => setCard({ ...card, cvv: value })}
                    />
                  </div>
                  <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" /> Card details are used only for this mock
                    session.
                  </p>
                </div>
              )}
              {method === "netbanking" && (
                <SelectField
                  label="Select your bank"
                  value={bank}
                  onChange={setBank}
                  options={[
                    "HDFC Bank",
                    "ICICI Bank",
                    "State Bank of India",
                    "Axis Bank",
                    "Kotak Mahindra Bank",
                  ]}
                />
              )}
              {method === "wallet" && (
                <SelectField
                  label="Select your wallet"
                  value={wallet}
                  onChange={setWallet}
                  options={["PhonePe", "Paytm", "Amazon Pay", "Mobikwik"]}
                />
              )}
              {method === "cod" && (
                <div>
                  <p className="text-sm font-medium">Pay in cash when your order arrives.</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    A nominal handling charge may apply at delivery. Please keep the exact amount
                    ready for our delivery partner.
                  </p>
                  <label className="mt-5 flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={wallet === "confirmed"}
                      onChange={(event) => setWallet(event.target.checked ? "confirmed" : "")}
                      className="accent-primary"
                    />{" "}
                    I confirm this cash-on-delivery order.
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <LuxeButton
            onClick={submit}
            disabled={submitting}
            className="mt-6 w-full sm:w-auto"
            arrow
          >
            {submitting
              ? "Processing securely..."
              : method === "cod"
                ? "Place Order"
                : `Pay ${inr(draft.total)}`}
          </LuxeButton>
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Demo checkout. No real payment will be processed.
          </p>
        </div>

        <aside className="md:sticky md:top-16 md:self-start">
          <div className="rounded-md border border-border bg-card p-8 soft-shadow">
            <p className="text-eyebrow">Order summary</p>
            <div className="mt-6 space-y-5">
              {draft.items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-24 w-20 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{item.product.name}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {item.color} · Size {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm">{inr(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
              <SummaryRow label="Subtotal" value={inr(draft.subtotal)} />
              <SummaryRow
                label="Shipping"
                value={draft.shipping === 0 ? "Complimentary" : inr(draft.shipping)}
              />
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg">
                <span className="text-display">Total</span>
                <span className="font-medium">{inr(draft.total)}</span>
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
  onChange,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        <option value="">Choose an option</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function validate(
  method: PaymentMethod,
  values: {
    upi: string;
    card: { number: string; name: string; expiry: string; cvv: string };
    bank: string;
    wallet: string;
  },
) {
  if (method === "upi" && !/^[\w.-]+@[\w.-]+$/.test(values.upi.trim()))
    return "Enter a valid UPI ID, such as name@bank.";
  if (method === "card") {
    if (!/^\d{12,19}$/.test(values.card.number.replace(/\s/g, "")))
      return "Enter a valid card number.";
    if (!values.card.name.trim()) return "Enter the name on your card.";
    if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(values.card.expiry.trim()))
      return "Enter expiry as MM / YY.";
    if (!/^\d{3,4}$/.test(values.card.cvv)) return "Enter a valid CVV.";
  }
  if (method === "netbanking" && !values.bank) return "Select your bank.";
  if (method === "wallet" && !values.wallet) return "Select your wallet.";
  if (method === "cod" && values.wallet !== "confirmed")
    return "Confirm the cash-on-delivery order to continue.";
  return "";
}
