import type { Product } from "@/lib/haston-data";

export type CheckoutItem = {
  product: Product;
  quantity: number;
  color: string;
  size: string;
};

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";

export type OrderDraft = {
  items: CheckoutItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  shippingAddress?: Record<string, string>;
};

export type CreatedOrder = OrderDraft & {
  orderNumber: string;
};

const DRAFT_KEY = "haston_checkout_draft";
const CONFIRMED_ORDER_KEY = "haston_confirmed_order";

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

export const mockPaymentGateway = async (
  method: PaymentMethod,
  details?: { upi?: string; card?: { number?: string } },
) => {
  await new Promise((resolve) => window.setTimeout(resolve, 650));
  const declined =
    details?.upi?.trim().toLowerCase() === "fail@mock" ||
    details?.card?.number?.replace(/\s/g, "") === "0000000000000000";
  return { success: !declined, method, reference: `MOCK-${Date.now()}` };
};

export const createMockOrder = async (draft: OrderDraft): Promise<CreatedOrder> => {
  await new Promise((resolve) => window.setTimeout(resolve, 500));
  const order = { ...draft, orderNumber: `HV-${String(Date.now()).slice(-6)}` };
  sessionStorage.setItem(CONFIRMED_ORDER_KEY, JSON.stringify(order));
  sessionStorage.removeItem(DRAFT_KEY);
  return order;
};

export const readConfirmedOrder = (): CreatedOrder | null => {
  const raw = sessionStorage.getItem(CONFIRMED_ORDER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CreatedOrder;
  } catch {
    sessionStorage.removeItem(CONFIRMED_ORDER_KEY);
    return null;
  }
};
