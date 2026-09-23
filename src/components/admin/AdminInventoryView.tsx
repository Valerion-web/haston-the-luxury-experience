import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, AlertTriangle, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { hastonApi } from "@/lib/haston-api";

export function AdminInventoryView() {
  const queryClient = useQueryClient();
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingStock, setEditingStock] = useState(0);

  const {
    data: inventory = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["haston", "admin-inventory"],
    queryFn: () => hastonApi.adminInventory(lowStockThreshold),
  });

  const updateStockMutation = useMutation({
    mutationFn: (data: { id: number; countInStock: number }) =>
      hastonApi.updateAdminInventory(data.id, data.countInStock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["haston", "admin-inventory"] });
      setEditingId(null);
    },
  });

  const lowStockItems = inventory.filter((item) => item.countInStock <= item.lowStockAlert);
  const outOfStockItems = inventory.filter((item) => item.countInStock === 0);

  const handleEditStock = (id: number, currentStock: number) => {
    setEditingId(id);
    setEditingStock(currentStock);
  };

  const handleSaveStock = () => {
    if (editingId !== null) {
      updateStockMutation.mutate({ id: editingId, countInStock: editingStock });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-display text-xl tracking-[0.2em]">Inventory</div>
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
          <p className="text-display text-xl tracking-[0.2em]">Inventory</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {outOfStockItems.length} out of stock · {lowStockItems.length} low stock
          </p>
        </div>
        <button
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors hover:border-primary disabled:opacity-50"
        >
          <RefreshCw className={isFetching ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} /> Refresh
        </button>
      </div>

      {/* Alerts Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        {outOfStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <div className="flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">{outOfStockItems.length} Out of Stock</p>
                <p className="mt-1 text-sm text-red-700">Immediate restock required</p>
              </div>
            </div>
          </motion.div>
        )}

        {lowStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-yellow-200 bg-yellow-50 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">{lowStockItems.length} Low Stock</p>
                <p className="mt-1 text-sm text-yellow-700">Below alert threshold</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Unable to load inventory"}
          </p>
        </div>
      )}

      {inventory.length === 0 && !error && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">No inventory items</p>
        </div>
      )}

      {/* Inventory Table */}
      <div className="space-y-3">
        {inventory.map((item) => {
          const isOutOfStock = item.countInStock === 0;
          const isLowStock = item.countInStock > 0 && item.countInStock <= item.lowStockAlert;
          const isEditing = editingId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg border p-4 soft-shadow transition-shadow hover:shadow-md md:p-5 ${
                isOutOfStock
                  ? "border-red-200 bg-red-50"
                  : isLowStock
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-border bg-card"
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    {item.images && item.images.length > 0 && (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-16 w-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 font-medium">{item.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.sku || "No SKU"}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.category && (
                          <span className="inline-flex rounded-full bg-secondary/50 px-2 py-1 text-[10px] uppercase tracking-[0.12em]">
                            {item.category.name}
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-200 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-red-800 font-medium">
                            <TrendingDown className="h-3 w-3" />
                            Out of Stock
                          </span>
                        )}
                        {isLowStock && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-200 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-yellow-800 font-medium">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 md:flex-row md:items-center">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Current Stock</p>
                    {isEditing ? (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="number"
                          value={editingStock}
                          onChange={(e) => setEditingStock(parseInt(e.target.value))}
                          className="w-16 rounded border border-border bg-background px-2 py-1 text-sm outline-none focus:border-primary"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveStock}
                          disabled={updateStockMutation.isPending}
                          className="rounded bg-primary text-primary-foreground px-2 py-1 text-xs font-medium disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded border border-border px-2 py-1 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <p
                          className={`mt-1 font-medium text-lg ${isOutOfStock ? "text-red-600" : isLowStock ? "text-yellow-600" : ""}`}
                        >
                          {item.countInStock}
                        </p>
                        <button
                          onClick={() => handleEditStock(item.id, item.countInStock)}
                          className="mt-1 text-[10px] uppercase tracking-[0.12em] text-primary hover:underline"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Alert Level</p>
                    <p className="mt-1 font-medium">{item.lowStockAlert}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="mt-1 font-medium">₹{item.price.toLocaleString()}</p>
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
