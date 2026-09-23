import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import { hastonApi, type AdminProduct } from "@/lib/haston-api";

export function AdminProductDetailsView({ productId }: { productId?: number }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !productId;

  const [formData, setFormData] = useState<Partial<AdminProduct>>({
    name: "",
    slug: "",
    sku: "",
    price: 0,
    description: "",
    countInStock: 0,
    lowStockAlert: 5,
    status: "ACTIVE",
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["haston", "admin-product", productId],
    queryFn: () => (productId ? hastonApi.adminProductById(productId) : null),
    enabled: !!productId,
  });

  useEffect(() => {
    if (!product) return;
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku || "",
      price: product.price,
      description: product.description || product.fullDescription || product.shortDescription || "",
      countInStock: product.countInStock,
      lowStockAlert: product.lowStockAlert,
      status: product.status,
    });
  }, [product]);

  const createMutation = useMutation({
    mutationFn: (data: Partial<AdminProduct>) => hastonApi.createAdminProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["haston", "admin-products"] });
      void navigate({ to: "/admin/products" });
    },
    onError: (err) => setSubmitError(err instanceof Error ? err.message : "Failed to create"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<AdminProduct>) =>
      productId ? hastonApi.updateAdminProduct(productId, data) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["haston", "admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["haston", "admin-product", productId] });
      void navigate({ to: "/admin/products" });
    },
    onError: (err) => setSubmitError(err instanceof Error ? err.message : "Failed to update"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.name || !formData.slug) {
      setSubmitError("Name and slug are required");
      return;
    }

    if (isNew) {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate(formData);
    }
  };

  const handleChange = (field: keyof AdminProduct, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading product...</div>;
  }
  if (error) {
    return (
      <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Unable to load product"}
        </p>
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <button
        onClick={() => navigate({ to: "/admin/products" })}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </button>

      <div>
        <p className="text-display text-xl tracking-[0.2em]">
          {isNew ? "New Product" : "Edit Product"}
        </p>
      </div>

      {submitError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <fieldset className="space-y-4 rounded-lg border border-border bg-card p-6 soft-shadow">
          <legend className="text-sm uppercase tracking-[0.15em]">Basic Information</legend>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug || ""}
                onChange={(e) => handleChange("slug", e.target.value)}
                className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku || ""}
                onChange={(e) => handleChange("sku", e.target.value)}
                className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Price (₹)
              </label>
              <input
                type="number"
                value={formData.price || 0}
                onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              rows={4}
            />
          </div>
        </fieldset>

        {/* Inventory */}
        <fieldset className="space-y-4 rounded-lg border border-border bg-card p-6 soft-shadow">
          <legend className="text-sm uppercase tracking-[0.15em]">Inventory</legend>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Stock Count
              </label>
              <input
                type="number"
                value={formData.countInStock || 0}
                onChange={(e) => handleChange("countInStock", parseInt(e.target.value))}
                className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Low Stock Alert
              </label>
              <input
                type="number"
                value={formData.lowStockAlert || 5}
                onChange={(e) => handleChange("lowStockAlert", parseInt(e.target.value))}
                className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Status
            </label>
            <select
              value={formData.status || "ACTIVE"}
              onChange={(e) => handleChange("status", e.target.value)}
              className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>
        </fieldset>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/products" })}
            className="flex-1 rounded border border-border px-4 py-2 text-sm uppercase tracking-[0.15em] transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 rounded bg-primary text-primary-foreground px-4 py-2 text-sm uppercase tracking-[0.15em] transition-all hover:shadow-md disabled:opacity-50"
          >
            {isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
            {isNew ? "Create Product" : "Save Changes"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
