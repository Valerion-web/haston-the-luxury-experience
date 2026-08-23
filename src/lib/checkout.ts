import { PRODUCTS } from "@/lib/haston-data";

/**
 * Checkout state layer.
 * Purely client-side for now — every read/write goes through the helpers below so
 * they can be swapped for real backend/cart API calls without touching the UI.
 */

export type CheckoutLine = {
  id: string;
  qty: number;
  size: string;
  color: string;
};

export type CheckoutItem = CheckoutLine & {
  name: string;
  slug: string;
  image: string;
  price: number;
};

export type CheckoutDetails = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type PaymentMethodId = "upi" | "card" | "netbanking" | "wallet" | "cod";

export type PlacedOrder = {
  orderId: string;
  paymentId: string;
  method: PaymentMethodId;
  placedAt: string;
  items: CheckoutItem[];
  details: CheckoutDetails;
  totals: OrderTotals;
};

export type OrderTotals = {
  subtotal: number;
  shipping: number;
  total: number;
};

const KEY_LINES = "haston.checkout.lines";
const KEY_DETAILS = "haston.checkout.details";
const KEY_ORDER = "haston.checkout.order";

/** Fallback bag contents so the flow is testable without a persisted cart. */
const DEFAULT_LINES: CheckoutLine[] = [
  { id: "1", qty: 1, size: "M", color: "Navy" },
  { id: "3", qty: 2, size: "L", color: "Olive" },
];

const read = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const write = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — non fatal */
  }
};

export const setCheckoutLines = (lines: CheckoutLine[]) => write(KEY_LINES, lines);

export const getCheckoutLines = (): CheckoutLine[] => read<CheckoutLine[]>(KEY_LINES) ?? DEFAULT_LINES;

export const getCheckoutItems = (): CheckoutItem[] =>
  getCheckoutLines()
    .map((l) => {
      const p = PRODUCTS.find((x) => x.id === l.id);
      if (!p) return null;
      return {
        ...l,
        name: p.name,
        slug: p.slug,
        image: p.image,
        price: p.price,
      } satisfies CheckoutItem;
    })
    .filter((x): x is CheckoutItem => x !== null);

export const SHIPPING_FREE_ABOVE = 180;
export const SHIPPING_FLAT = 12;

export const getTotals = (items: CheckoutItem[]): OrderTotals => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > SHIPPING_FREE_ABOVE || subtotal === 0 ? 0 : SHIPPING_FLAT;
  return { subtotal, shipping, total: subtotal + shipping };
};

export const saveDetails = (d: CheckoutDetails) => write(KEY_DETAILS, d);
export const getDetails = (): CheckoutDetails | null => read<CheckoutDetails>(KEY_DETAILS);

export const saveOrder = (o: PlacedOrder) => write(KEY_ORDER, o);
export const getOrder = (): PlacedOrder | null => read<PlacedOrder>(KEY_ORDER);

export const clearCheckout = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY_LINES);
  window.sessionStorage.removeItem(KEY_DETAILS);
};

/* ---------------------------------- validation --------------------------------- */

export const EMPTY_DETAILS: CheckoutDetails = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export type DetailErrors = Partial<Record<keyof CheckoutDetails, string>>;

export function validateDetails(d: CheckoutDetails): DetailErrors {
  const e: DetailErrors = {};
  if (d.fullName.trim().length < 3) e.fullName = "Enter your full name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = "Enter a valid email address";
  if (!/^[6-9]\d{9}$/.test(d.phone.replace(/\D/g, "").slice(-10)))
    e.phone = "Enter a valid 10-digit mobile number";
  if (d.address.trim().length < 8) e.address = "Enter your full street address";
  if (d.city.trim().length < 2) e.city = "Enter your city";
  if (d.state.trim().length < 2) e.state = "Select your state";
  if (!/^\d{6}$/.test(d.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode";
  return e;
}

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
