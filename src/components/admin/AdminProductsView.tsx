import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { RefreshCw, Plus, AlertTriangle, Trash2, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { hastonApi } from "@/lib/haston-api";

export function AdminProductsView() {
  const [search, setSearch] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["haston", "admin-products"],
    queryFn: () => hastonApi.adminProducts(),
  });
  const deleteMutation = useMutation({
    mutationFn: (productId: number) => hastonApi.deleteAdminProduct(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["haston", "admin-products"] });
      setActionMessage("Product deleted successfully.");
    },
    onError: (error) => {
      setActionMessage(error instanceof Error ? error.message : "Unable to delete product.");
    },
  });

  const handleDelete = (productId: number, productName: string) => {
    if (!window.confirm(`Delete ${productName}? This action cannot be undone.`)) return;
    setActionMessage("");
    deleteMutation.mutate(productId);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-display text-xl tracking-[0.2em]">Products</div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-display text-xl tracking-[0.2em]">Products</p>
          <p className="mt-1 text-sm text-muted-foreground">{filteredProducts.length} products</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors hover:border-primary disabled:opacity-50"
          >
            <RefreshCw className={isFetching ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            Refresh
          </button>
          <Link
            to="/admin/products/$id"
            params={{ id: "new" }}
            className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary text-primary-foreground px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition-all hover:shadow-md"
          >
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Link>
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Unable to load products"}
          </p>
        </div>
      )}
      {actionMessage && (
        <div
          role="alert"
          className={`rounded-lg border p-4 ${deleteMutation.isError ? "border-destructive/50 bg-destructive/10 text-destructive" : "border-green-200 bg-green-50 text-green-800"}`}
        >
          <p className="text-sm">{actionMessage}</p>
        </div>
      )}

      {filteredProducts.length === 0 && !error && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">No products found</p>
        </div>
      )}

      {/* Products Table */}
      <div className="space-y-3">
        {filteredProducts.map((product) => {
          const isLowStock = product.countInStock <= product.lowStockAlert;
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-border bg-card p-4 soft-shadow transition-shadow hover:shadow-md md:p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-16 w-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        to="/admin/products/$id"
                        params={{ id: String(product.id) }}
                        className="line-clamp-2 font-medium text-primary hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {product.sku || "No SKU"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {product.category && (
                          <span className="inline-flex rounded-full bg-secondary/50 px-2 py-1 text-[10px] uppercase tracking-[0.12em]">
                            {product.category.name}
                          </span>
                        )}
                        {product.status !== "ACTIVE" && (
                          <span className="inline-flex rounded-full bg-muted px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                            {product.status}
                          </span>
                        )}
                        {isLowStock && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-yellow-800">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 md:w-auto md:text-right">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="mt-1 font-medium">₹{product.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className={`mt-1 font-medium ${isLowStock ? "text-yellow-600" : ""}`}>
                      {product.countInStock}
                    </p>
                  </div>
                  <div className="flex items-end justify-end gap-2">
                    <Link
                      to="/admin/products/$id"
                      params={{ id: String(product.id) }}
                      className="rounded p-2 transition-colors hover:bg-muted"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deleteMutation.isPending}
                      className="rounded p-2 transition-colors hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
