import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Package } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { clearSession } from "@/lib/haston-session";
import { useHastonSession } from "@/hooks/use-haston-session";
import { AdminOrdersView } from "@/components/admin/AdminOrdersView";
import { AdminOrderDetailsView } from "@/components/admin/AdminOrderDetailsView";

export function AdminLayout({ children }: { children?: ReactNode }) {
  const session = useHastonSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (!session) void navigate({ to: "/login", replace: true });
    else if (session.role !== "ADMIN") void navigate({ to: "/account", replace: true });
  }, [navigate, session]);

  if (!session || session.role !== "ADMIN") return null;

  const signOut = () => {
    clearSession();
    queryClient.removeQueries({
      predicate: ({ queryKey }) =>
        queryKey[0] === "haston" && String(queryKey[1]).startsWith("admin"),
    });
    void navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-[80vh] bg-secondary/20">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-6 py-8 md:px-10 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-md border border-border bg-card p-6 soft-shadow lg:sticky lg:top-24">
            <p className="text-display text-xl tracking-[0.2em]">HASTON</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Admin atelier
            </p>
            <nav className="mt-8 space-y-1">
              <Link
                to="/admin"
                activeOptions={{ exact: true }}
                className="flex items-center gap-3 rounded px-3 py-3 text-[10px] uppercase tracking-[0.22em] transition-colors hover:bg-muted data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
              >
                <LayoutDashboard className="h-4 w-4" /> Overview
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center gap-3 rounded px-3 py-3 text-[10px] uppercase tracking-[0.22em] transition-colors hover:bg-muted data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
              >
                <Package className="h-4 w-4" /> Orders
              </Link>
            </nav>
            <button
              onClick={signOut}
              className="mt-8 flex w-full items-center gap-3 rounded px-3 py-3 text-left text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          {children ||
            (pathname.startsWith("/admin/orders/") ? (
              <AdminOrderDetailsView orderId={Number(pathname.split("/").pop())} />
            ) : pathname === "/admin/orders" ? (
              <AdminOrdersView />
            ) : (
              <Outlet />
            ))}
        </main>
      </div>
    </div>
  );
}
