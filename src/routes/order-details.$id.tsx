import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, Check, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { inr } from "@/lib/haston-data";
import { hastonApi } from "@/lib/haston-api";
import { useHastonSession } from "@/hooks/use-haston-session";
import { PageHero } from "@/components/ui-haston/PageHero";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";

export const Route = createFileRoute("/order-details/$id")({
  head: () => ({ meta: [{ title: "Order Details — HASTON" }, { name: "description", content: "View your HASTON order details." }] }),
  component: OrderDetails,
});

function OrderDetails() {
  const { id } = Route.useParams();
  const session = useHastonSession();
  const navigate = useNavigate();
  const orderId = Number(id);
  const { data: order, isLoading, error } = useQuery({ queryKey: ["haston", "order", orderId], queryFn: () => hastonApi.order(orderId), enabled: Boolean(session) && Number.isInteger(orderId) && orderId > 0 });
  useEffect(() => { if (!session) void navigate({ to: "/login", replace: true }); }, [navigate, session]);
  if (!session) return null;
  if (isLoading) return <State message="Loading your order..." />;
  if (error || !order) return <State message={error instanceof Error ? error.message : "This order could not be found."} error />;
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = Math.max(0, order.totalPrice - subtotal);
  return <><PageHero eyebrow="Account" title="Order details." breadcrumb={[{ label: "Account", to: "/account" }, { label: "Orders", to: "/orders" }, { label: `Order ${order.id}` }]} /><section className="mx-auto max-w-[1100px] px-6 py-10 md:px-10"><Link to="/orders" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Back to orders</Link><div className="mt-6 rounded-md border border-border bg-card p-6 soft-shadow md:p-8"><div className="flex flex-wrap items-start justify-between gap-5 border-b border-border pb-6"><div className="flex items-center gap-3"><Package className="h-5 w-5 text-accent" /><div><p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Order ID</p><p className="mt-1 text-display text-2xl">{order.id}</p><p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" }) : "Date unavailable"}</p></div></div><div className="text-right"><p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Status</p><p className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-accent"><Check className="h-3 w-3" /> {order.status}</p></div></div><div className="divide-y divide-border">{order.items.map((item) => <div key={item.id} className="flex gap-4 py-5"><img src={item.product.image || undefined} alt={item.product.name} className="h-28 w-22 shrink-0 rounded object-cover" /><div className="min-w-0 flex-1"><p className="text-display text-lg">{item.product.name}</p><p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{item.variant?.color || "Selected"} · Size {item.variant?.size || "Standard"} · Qty {item.quantity}</p><p className="mt-3 text-xs text-muted-foreground">Unit price {inr(item.price)}</p></div><p className="text-sm font-medium">{inr(item.price * item.quantity)}</p></div>)}</div><div className="space-y-2 border-t border-border pt-5 text-sm"><div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="text-foreground">{inr(subtotal)}</span></div><div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="text-foreground">{shipping ? inr(shipping) : "Complimentary"}</span></div><div className="flex justify-between pt-3 text-lg"><span className="text-display">Grand total</span><span className="font-medium">{inr(order.totalPrice)}</span></div></div></div><div className="mt-8"><LuxeButton to="/orders" arrow>Back to orders</LuxeButton></div></section></>;
}

function State({ message, error = false }: { message: string; error?: boolean }) { return <section className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-6 py-16 text-center"><div><p className="text-eyebrow text-muted-foreground">{error ? "Order unavailable" : "Orders"}</p><h1 className="mt-4 text-display text-3xl">{message}</h1><LuxeButton to="/orders" className="mt-8" arrow>Back to orders</LuxeButton></div></section>; }
