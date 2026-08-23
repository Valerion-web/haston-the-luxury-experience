import type { Product } from "@/lib/haston-data";
import { apiRequest, resolveBackendAssetUrl } from "@/lib/api-client";

export type BackendProduct = {
  id: number;
  slug: string;
  name: string;
  price: number;
  description?: string | null;
  images?: string[];
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
export type AuthResponse = {
  token: string;
  user: import("@/lib/haston-session").SessionUser;
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
  slug: product.slug,
  name: product.name,
  category:
    product.category?.slug || product.category?.name?.toLowerCase().replace(/\s+/g, "-") || "",
  price: Number(product.price),
  image: resolveBackendAssetUrl(product.image || product.images?.[0]),
  hoverImage: resolveBackendAssetUrl(product.hoverImage || product.images?.[1] || product.image),
  colors: (product.colors || []).map((name) => ({ name, hex: colorHex[name] || "#888888" })),
  sizes: product.sizes || [],
  rating: 0,
  reviews: 0,
  isNew: product.tags?.includes("new"),
  isBestseller: product.tags?.includes("bestseller"),
  description: product.description || "",
  variants: product.variants,
});
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
const mapCart = (cart: BackendCartResponse): CartResponse => ({
  id: cart.id,
  items: cart.items.map((item) => ({ ...item, product: mapProduct(item.product) })),
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
  logout: () => apiRequest<{ message: string }>("/auth/logout", { method: "POST" }),
  cart: () => apiRequest<BackendCartResponse>("/cart").then(mapCart),
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
};
