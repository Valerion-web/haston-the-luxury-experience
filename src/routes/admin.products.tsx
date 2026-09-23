import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products — HASTON Admin" }] }),
  component: AdminLayout,
});
