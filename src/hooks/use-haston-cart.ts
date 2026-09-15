import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHastonSession } from "@/hooks/use-haston-session";
import { hastonApi, type CartResponse } from "@/lib/haston-api";

export const HASTON_CART_QUERY_KEY = ["haston", "cart"] as const;

export const useHastonCart = () => {
  const session = useHastonSession();
  const queryClient = useQueryClient();
  const cartQuery = useQuery({
    queryKey: HASTON_CART_QUERY_KEY,
    queryFn: hastonApi.cart,
    enabled: Boolean(session),
  });

  useEffect(() => {
    if (!session) {
      queryClient.removeQueries({ queryKey: HASTON_CART_QUERY_KEY, exact: true });
    }
  }, [queryClient, session]);

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity, variantId }: { productId: number; quantity: number; variantId?: number }) =>
      hastonApi.addCartItem(productId, quantity, variantId),
    onSuccess: async (cart) => {
      queryClient.setQueryData<CartResponse>(HASTON_CART_QUERY_KEY, cart);
      await queryClient.invalidateQueries({ queryKey: HASTON_CART_QUERY_KEY });
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      hastonApi.updateCartItem(id, quantity),
    onSuccess: async (cart) => {
      queryClient.setQueryData<CartResponse>(HASTON_CART_QUERY_KEY, cart);
      await queryClient.invalidateQueries({ queryKey: HASTON_CART_QUERY_KEY });
    },
  });
  const removeMutation = useMutation({
    mutationFn: (id: number) => hastonApi.removeCartItem(id),
    onSuccess: async (cart) => {
      queryClient.setQueryData<CartResponse>(HASTON_CART_QUERY_KEY, cart);
      await queryClient.invalidateQueries({ queryKey: HASTON_CART_QUERY_KEY });
    },
  });

  return {
    cart: cartQuery.data,
    items: cartQuery.data?.items ?? [],
    isLoading: cartQuery.isLoading,
    error: cartQuery.error,
    refetch: cartQuery.refetch,
    addItem: addMutation.mutateAsync,
    updateQuantity: updateMutation.mutateAsync,
    removeItem: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isMutating: addMutation.isPending || updateMutation.isPending || removeMutation.isPending,
  };
};
