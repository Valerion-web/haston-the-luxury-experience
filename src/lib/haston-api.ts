import type { Product } from "@/lib/haston-data";
import { apiRequest, resolveBackendAssetUrl } from "@/lib/api-client";

export type BackendProduct = {
  id: number;
  slug: string;
  name: string;
  price: number;
  description?: string | null;
  images?: string[] | string;
  imagesList?: Array<{ url: string; sortOrder?: number }>;
  image?: string | null;
  hoverImage?: string | null;
  sizes?: string[];
  colors?: string[];
  category?: { id: number; name: string; slug?: string } | null;
  tags?: string[];
  variants?: Array<{
    id: number;
    sku: string;
    size?: string | null;
    color?: string | null;
    quantityOnHand: number;
    priceOverride?: number | null;
  }>;
};
export type BackendCategory = {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  productCount?: number;
};
export type BackendBrand = {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  logo?: string | null;
};
export type BackendWishlistItem = {
  id: number;
  product: BackendProduct;
  createdAt?: string;
};
export type BackendWishlistResponse = {
  id: number | null;
  items: BackendWishlistItem[];
};
export type WishlistItem = {
  id: number;
  product: Product;
  createdAt?: string;
};
export type WishlistResponse = {
  id: number | null;
  items: WishlistItem[];
};
export type AuthResponse = {
  user: import("@/lib/haston-session").SessionUser;
};
export type AdminDashboardData = {
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  revenueChangePct: number | null;
  ordersChangePct: number | null;
  averageOrderValueChangePct: number | null;
};
export type AdminProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
  description: string | null;
  brand: string | null;
  price: number;
  discountPercent: number;
  tax: number;
  countInStock: number;
  lowStockAlert: number;
  availability: string;
  warehouse: string | null;
  images: string[];
  collection: string | null;
  tags: string[];
  size: string | null;
  color: string | null;
  material: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
  status: string;
  category: { id: number; name: string } | null;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
};
const colorHex: Record<string, string> = {
  Navy: "#0E1A2B",
  Ivory: "#F6F3E0",
  Olive: "#55684E",
  Sand: "#D8C8B2",
  Graphite: "#222222",
  Terracotta: "#B4553E",
  Denim: "#4A6B8A",
  Forest: "#2F4A32",
};
export const mapProduct = (product: BackendProduct): Product => ({
  id: String(product.id),
  backendId: product.id,
  slug: product.slug,
  name: product.name,
  category:
    product.category?.slug || product.category?.name?.toLowerCase().replace(/\s+/g, "-") || "",
  price: Number(product.price),
  image: resolveBackendAssetUrl(
    product.image ||
      product.imagesList?.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))[0]?.url ||
      (Array.isArray(product.images)
        ? product.images[0]
        : product.images
          ? parseImageList(product.images)[0]
          : undefined),
  ),
  hoverImage: resolveBackendAssetUrl(
    product.hoverImage ||
      product.imagesList?.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))[1]?.url ||
      (Array.isArray(product.images)
        ? product.images[1]
        : product.images
          ? parseImageList(product.images)[1]
          : undefined) ||
      product.image,
  ),
  colors: (product.colors || []).map((name) => ({ name, hex: colorHex[name] || "#888888" })),
  sizes: product.sizes || [],
  isNew: product.tags?.includes("new"),
  isBestseller: product.tags?.includes("bestseller"),
  description: product.description || "",
  variants: product.variants,
});
const parseImageList = (value: string): string[] => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed
      : value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};
export type CartItem = {
  id: number;
  product: Product;
  variant?: { id: number; size?: string | null; color?: string | null } | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  availableQuantity: number;
};
export type CartResponse = { id: number | null; items: CartItem[] };
export type OrderItem = {
  id: number;
  product: Product;
  variant?: { id: number; size?: string | null; color?: string | null } | null;
  quantity: number;
  price: number;
};
export type OrderResponse = {
  id: number;
  status: string;
  totalPrice: number;
  currency: string;
  payments?: Array<{
    provider: string;
    status: string;
  }>;
  shippingAddress?: string | null;
  billingAddress?: string | null;
  createdAt?: string;
  items: OrderItem[];
};
export type CheckoutValidationResponse = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;
};
export type RazorpayOrderResponse = {
  paymentId: number;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  receipt: string;
};
export type RazorpayVerifyResponse = {
  success: true;
  orderId: number;
  paymentStatus: "AUTHORIZED";
};
export type AdminOrderResponse = OrderResponse & {
  user?: { id: number; name?: string | null; email?: string | null; role?: string } | null;
};
type BackendCartResponse = {
  id: number | null;
  items: Array<{
    id: number;
    product: BackendProduct;
    variant?: CartItem["variant"];
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    availableQuantity: number;
  }>;
};
type BackendOrderResponse = Omit<OrderResponse, "items"> & {
  items: Array<Omit<OrderItem, "product"> & { product: BackendProduct }>;
};
type BackendAdminOrderResponse = Omit<AdminOrderResponse, "items"> & {
  user?: AdminOrderResponse["user"];
  items: Array<Omit<OrderItem, "product"> & { product: BackendProduct }>;
};
const mapCart = (cart: BackendCartResponse): CartResponse => ({
  id: cart.id,
  items: cart.items.map((item) => ({ ...item, product: mapProduct(item.product) })),
});
const mapOrder = (order: BackendOrderResponse): OrderResponse => ({
  ...order,
  totalPrice: Number(order.totalPrice),
  items: order.items.map((item) => ({
    ...item,
    price: Number(item.price),
    product: mapProduct(item.product),
  })),
});
const mapAdminOrder = (order: BackendAdminOrderResponse): AdminOrderResponse => ({
  ...mapOrder(order),
  user: order.user,
});
const mapWishlist = (wishlist: BackendWishlistResponse): WishlistResponse => ({
  id: wishlist.id,
  items: wishlist.items.map((item) => ({
    id: item.id,
    product: mapProduct(item.product),
    createdAt: item.createdAt,
  })),
});
export const hastonApi = {
  login: (email: string, password: string) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  products: (params: { category?: string; brand?: string; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.brand) query.set("brand", params.brand);
    if (params.search) query.set("search", params.search);
    return apiRequest<BackendProduct[]>(`/products${query.size ? `?${query}` : ""}`).then((items) =>
      items.map(mapProduct),
    );
  },
  productBySlug: (slug: string) =>
    apiRequest<BackendProduct>(`/products/slug/${encodeURIComponent(slug)}`).then(mapProduct),
  categories: () => apiRequest<BackendCategory[]>("/categories"),
  categoryBySlug: (slug: string) =>
    apiRequest<BackendCategory & { products: BackendProduct[] }>(
      `/categories/${encodeURIComponent(slug)}`,
    ),
  getWishlist: () => apiRequest<BackendWishlistResponse>("/wishlist").then(mapWishlist),
  addWishlistItem: (productId: number) =>
    apiRequest<BackendWishlistResponse>("/wishlist/items", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }).then(mapWishlist),
  removeWishlistItem: (productId: number) =>
    apiRequest<BackendWishlistResponse>(`/wishlist/items/${productId}`, {
      method: "DELETE",
    }).then(mapWishlist),
  logout: () => apiRequest<{ message: string }>("/auth/logout", { method: "POST" }),
  createOrder: (body: {
    shippingAddress: Record<string, string>;
    billingAddress?: Record<string, string>;
    couponCode?: string;
  }) =>
    apiRequest<BackendOrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }).then(mapOrder),
  orders: () =>
    apiRequest<BackendOrderResponse[]>("/orders").then((orders) => orders.map(mapOrder)),
  order: (id: number) => apiRequest<BackendOrderResponse>(`/orders/${id}`).then(mapOrder),
  adminOrders: () =>
    apiRequest<BackendAdminOrderResponse[]>("/admin/orders").then((orders) =>
      orders.map(mapAdminOrder),
    ),
  adminOrder: (id: number) =>
    apiRequest<BackendAdminOrderResponse>(`/admin/orders/${id}`).then(mapAdminOrder),
  updateAdminOrderStatus: (id: number, status: string) =>
    apiRequest<AdminOrderResponse>(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  cart: () => apiRequest<BackendCartResponse>("/cart").then(mapCart),
  validateCheckout: (couponCode?: string) =>
    apiRequest<CheckoutValidationResponse>("/checkout/validate", {
      method: "POST",
      body: JSON.stringify(couponCode ? { couponCode } : {}),
    }),
  razorpayOrder: (body: { idempotencyKey: string; couponCode?: string }) =>
    apiRequest<RazorpayOrderResponse>("/payments/razorpay/order", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  razorpayVerify: (body: {
    paymentId: number;
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    couponCode?: string;
    shippingAddress: Record<string, string>;
    billingAddress: Record<string, string>;
  }) =>
    apiRequest<RazorpayVerifyResponse>("/payments/razorpay/verify", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  addCartItem: (productId: number, quantity: number, variantId?: number) =>
    apiRequest<BackendCartResponse>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, variantId }),
    }).then(mapCart),
  updateCartItem: (id: number, quantity: number) =>
    apiRequest<BackendCartResponse>(`/cart/items/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }).then(mapCart),
  removeCartItem: (id: number) =>
    apiRequest<BackendCartResponse>(`/cart/items/${id}`, { method: "DELETE" }).then(mapCart),
  adminDashboard: (period: string = "today") =>
    apiRequest<AdminDashboardData>(`/admin/dashboard?period=${period}`),
  adminProducts: () => apiRequest<AdminProduct[]>("/admin/products"),
  adminProductById: (id: number) =>
    apiRequest<AdminProduct>(`/admin/products/${id}`),
  createAdminProduct: (data: Partial<AdminProduct>) =>
    apiRequest<AdminProduct>("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAdminProduct: (id: number, data: Partial<AdminProduct>) =>
    apiRequest<AdminProduct>(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteAdminProduct: (id: number) =>
    apiRequest<{ message: string }>(`/admin/products/${id}`, { method: "DELETE" }),
  adminInventory: (lowStockThreshold?: number) => {
    const query = lowStockThreshold ? `?lowStockThreshold=${lowStockThreshold}` : "";
    return apiRequest<AdminProduct[]>(`/admin/inventory${query}`);
  },
  updateAdminInventory: (id: number, countInStock: number) =>
    apiRequest<AdminProduct>(`/admin/inventory/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ countInStock }),
    }),
};
