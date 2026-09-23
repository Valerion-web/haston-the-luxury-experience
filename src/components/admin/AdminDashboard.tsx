import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, IndianRupee, Package, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { hastonApi } from "@/lib/haston-api";
import { AdminOrdersView } from "./AdminOrdersView";

function StatCard({
  icon: Icon,
  label,
  value,
  changePct,
}: {
  icon: React.ComponentType<{ className: string }>;
  label: string;
  value: string | number;
  changePct: number | null;
}) {
  const isPositive = changePct !== null && changePct >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border bg-card p-6 soft-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
          <p className="mt-3 text-display text-3xl font-light tracking-tight">{value}</p>
          {changePct !== null && (
            <div className="mt-2 flex items-center gap-1.5">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {changePct > 0 ? "+" : ""}
                {changePct}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}

export function AdminDashboard() {
  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ["haston", "admin-dashboard", "today"],
    queryFn: () => hastonApi.adminDashboard("today"),
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["haston", "admin-orders"],
    queryFn: () => hastonApi.adminOrders(),
  });

  const summary = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
    };
  }, [orders]);

  if (dashboardLoading || ordersLoading) {
    return (
      <div className="space-y-6">
        <div className="text-display text-xl tracking-[0.2em]">Dashboard</div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: IndianRupee,
      label: "Total Revenue",
      value: `₹${summary.totalRevenue.toLocaleString()}`,
      changePct: dashboard?.revenueChangePct ?? null,
    },
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: summary.totalOrders,
      changePct: dashboard?.ordersChangePct ?? null,
    },
    {
      icon: Package,
      label: "Avg Order Value",
      value: `₹${Math.round(summary.averageOrderValue).toLocaleString()}`,
      changePct: dashboard?.averageOrderValueChangePct ?? null,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <p className="text-display text-xl tracking-[0.2em]">Dashboard</p>
        <p className="mt-1 text-sm text-muted-foreground">Today's overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            value={card.value}
            changePct={card.changePct}
          />
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-display text-lg tracking-[0.15em]">Recent Orders</p>
            <p className="text-sm text-muted-foreground">Latest {orders?.length || 0} orders</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-sm uppercase tracking-[0.15em] text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <AdminOrdersView limit={5} />
      </div>
    </motion.div>
  );
}
