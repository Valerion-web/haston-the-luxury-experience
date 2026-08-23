import { useQuery } from "@tanstack/react-query";
import { hastonApi } from "@/lib/haston-api";

export const useHastonProducts = (
  params: { category?: string; brand?: string; search?: string } = {},
) =>
  useQuery({ queryKey: ["haston", "products", params], queryFn: () => hastonApi.products(params) });
export const useHastonProduct = (slug: string) =>
  useQuery({
    queryKey: ["haston", "product", slug],
    queryFn: () => hastonApi.productBySlug(slug),
    enabled: Boolean(slug),
  });
export const useHastonCategories = () =>
  useQuery({ queryKey: ["haston", "categories"], queryFn: hastonApi.categories });
export const useHastonCategory = (slug: string) =>
  useQuery({
    queryKey: ["haston", "category", slug],
    queryFn: () => hastonApi.categoryBySlug(slug),
    enabled: Boolean(slug),
  });
