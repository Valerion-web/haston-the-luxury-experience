import { inr } from "@/lib/haston-data";
import type { CheckoutItem, OrderTotals } from "@/lib/checkout";

export function OrderSummary({
  items,
  totals,
  title = "Order summary",
}: {
  items: CheckoutItem[];
  totals: OrderTotals;
  title?: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-6 md:p-8 soft-shadow">
      <p className="text-eyebrow">{title}</p>

      <div className="mt-6 space-y-5">
        {items.map((i) => (
          <div key={`${i.id}-${i.size}-${i.color}`} className="flex gap-4">
            <img
              src={i.image}
              alt={i.name}
              className="h-24 w-20 shrink-0 rounded object-cover"
              loading="lazy"
            />
            <div className="min-w-0 flex-1">
              <p className="text-display text-base leading-tight">{i.name}</p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {i.color} · Size {i.size}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Qty {i.qty} · {inr(i.price)}
              </p>
            </div>
            <p className="text-sm font-medium">{inr(i.price * i.qty)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 hairline pt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{inr(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{totals.shipping === 0 ? "Complimentary" : inr(totals.shipping)}</span>
        </div>
        <div className="hairline mt-3 flex justify-between pt-4 text-lg">
          <span className="text-display">Total</span>
          <span className="font-medium">{inr(totals.total)}</span>
        </div>
      </div>
    </div>
  );
}
