import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/products/$id")({
  head: () => ({ meta: [{ title: "Product Details — HASTON Admin" }] }),
  component: AdminLayout,
});
