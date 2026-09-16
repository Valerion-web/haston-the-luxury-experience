/** Shared checkout display types for existing UI components. Commerce state belongs to the backend. */

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
