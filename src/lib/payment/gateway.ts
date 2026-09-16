import type { CheckoutDetails, CheckoutItem, OrderTotals, PaymentMethodId } from "@/lib/checkout";

/**
 * Modular payment layer.
 *
 * `PaymentGateway` is the single seam between the UI and a provider.
 * Provider execution belongs in the backend. This interface remains for future
 * integration work, but it must never report a client-side payment as successful.
 */

export type PaymentRequest = {
  items: CheckoutItem[];
  details: CheckoutDetails;
  totals: OrderTotals;
  method: PaymentMethodId;
};

export type PaymentResult = {
  status: "succeeded" | "failed";
  paymentId: string;
  orderId: string;
  message?: string;
};

export type PaymentGateway = {
  id: string;
  /** Runs the payment. Resolve on success, reject/return failed on error. */
  pay: (req: PaymentRequest) => Promise<PaymentResult>;
};

export const paymentGateway: PaymentGateway = {
  id: "unavailable",
  pay: async () => ({
    status: "failed",
    paymentId: "",
    orderId: "",
    message: "Payment processing is not available yet.",
  }),
};

export const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  note: string;
}[] = [
  { id: "upi", label: "UPI", note: "GPay · PhonePe · Paytm · BHIM" },
  { id: "card", label: "Credit / Debit card", note: "Visa, Mastercard, RuPay, Amex" },
  { id: "netbanking", label: "Net banking", note: "All major Indian banks" },
  { id: "wallet", label: "Wallet", note: "Paytm · Amazon Pay · Mobikwik" },
  { id: "cod", label: "Cash on delivery", note: "Pay the courier on arrival" },
];
