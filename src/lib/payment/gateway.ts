import type { CheckoutDetails, CheckoutItem, OrderTotals, PaymentMethodId } from "@/lib/checkout";

/**
 * Modular payment layer.
 *
 * `PaymentGateway` is the single seam between the UI and a provider.
 * To go live, implement this interface with Razorpay / Stripe (open their SDK,
 * create the order on your backend, resolve with the provider ids) and export it
 * as `paymentGateway` instead of `mockGateway`. No UI change required.
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

const rand = (n: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 36).toString(36))
    .join("")
    .toUpperCase();

/** Mock provider — no real money movement, no gateway SDK. */
export const mockGateway: PaymentGateway = {
  id: "mock",
  pay: async ({ method }) =>
    new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            status: "succeeded",
            paymentId: `pay_mock_${rand(10)}`,
            orderId: `HV-${Date.now().toString().slice(-6)}${method === "cod" ? "-C" : ""}`,
          }),
        2200,
      );
    }),
};

export const paymentGateway: PaymentGateway = mockGateway;

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
