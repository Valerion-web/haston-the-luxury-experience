export type PaymentMethod = "razorpay";

export type OrderDraft = {
  idempotencyKey: string;
  paymentAttemptKey?: string;
  paymentMethod: PaymentMethod;
  shippingAddress?: Record<string, string>;
  paymentId?: number;
  razorpayOrderId?: string;
};

const DRAFT_KEY = "haston_checkout_draft";

export const createCheckoutIdempotencyKey = () =>
  typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createPaymentAttemptKey = (idempotencyKey: string) => {
  let paymentAttemptKey = createCheckoutIdempotencyKey();
  while (paymentAttemptKey === idempotencyKey) {
    paymentAttemptKey = createCheckoutIdempotencyKey();
  }
  return paymentAttemptKey;
};

export const saveCheckoutDraft = (draft: OrderDraft) => {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
};

export const readCheckoutDraft = (): OrderDraft | null => {
  const raw = sessionStorage.getItem(DRAFT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as OrderDraft;
  } catch {
    sessionStorage.removeItem(DRAFT_KEY);
    return null;
  }
};