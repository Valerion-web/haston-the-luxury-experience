import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHastonSession } from "@/hooks/use-haston-session";
import { ApiError } from "@/lib/api-client";
import { hastonApi, type WishlistResponse } from "@/lib/haston-api";

export const HASTON_WISHLIST_QUERY_KEY = ["haston", "wishlist"] as const;

export const useHastonWishlist = () => {
  const session = useHastonSession();
  const queryClient = useQueryClient();
  const wishlistQuery = useQuery({
    queryKey: HASTON_WISHLIST_QUERY_KEY,
    queryFn: hastonApi.getWishlist,
    enabled: Boolean(session),
  });
  const addMutation = useMutation({
    mutationFn: (productId: number) => {
      if (!session) throw new ApiError("Please sign in to manage your wishlist", 401);
      return hastonApi.addWishlistItem(productId);
    },
    onSuccess: async (wishlist) => {
      queryClient.setQueryData<WishlistResponse>(HASTON_WISHLIST_QUERY_KEY, wishlist);
      await queryClient.invalidateQueries({ queryKey: HASTON_WISHLIST_QUERY_KEY });
    },
  });
  const removeMutation = useMutation({
    mutationFn: (productId: number) => {
      if (!session) throw new ApiError("Please sign in to manage your wishlist", 401);
      return hastonApi.removeWishlistItem(productId);
    },
    onSuccess: async (wishlist) => {
      queryClient.setQueryData<WishlistResponse>(HASTON_WISHLIST_QUERY_KEY, wishlist);
      await queryClient.invalidateQueries({ queryKey: HASTON_WISHLIST_QUERY_KEY });
    },
  });
  const items = wishlistQuery.data?.items ?? [];
  const productIds = items.map((item) => item.product.backendId).filter((id): id is number => id !== undefined);
  const isPending = addMutation.isPending || removeMutation.isPending;

  return {
    items,
    productIds,
    count: items.length,
    isLoading: wishlistQuery.isLoading,
    error: wishlistQuery.error,
    isPending,
    isWishlisted: (productId: number | undefined) =>
      productId !== undefined && productIds.includes(productId),
    add: addMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    toggle: async (productId: number) => {
      if (productIds.includes(productId)) return removeMutation.mutateAsync(productId);
      return addMutation.mutateAsync(productId);
    },
  };
};
