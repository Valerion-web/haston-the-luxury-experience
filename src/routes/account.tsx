import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/ui-haston/PageHero";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Heart,
  MapPin,
  User,
  Bell,
  Wallet,
  Award,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { PRODUCTS, inr } from "@/lib/haston-data";
import { hastonApi } from "@/lib/haston-api";
import { clearSession } from "@/lib/haston-session";
import { useHastonSession } from "@/hooks/use-haston-session";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — HASTON" },
      { name: "description", content: "Your HASTON account dashboard." },
    ],
  }),
  component: Account,
});

const TABS = [
  { key: "overview", label: "Overview", icon: User },
  { key: "orders", label: "Orders", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "wallet", label: "Wallet", icon: Wallet },
  { key: "loyalty", label: "Loyalty", icon: Award },
  { key: "notifications", label: "Notifications", icon: Bell },
];

function Account() {
  const [tab, setTab] = useState("overview");
  const [signingOut, setSigningOut] = useState(false);
  const session = useHastonSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!session) void navigate({ to: "/login", replace: true });
  }, [navigate, session]);

  const signOut = async () => {
    setSigningOut(true);
    try {
      await hastonApi.logout();
    } catch {
      // Local cleanup must still run for expired or unavailable sessions.
    } finally {
      clearSession();
      queryClient.removeQueries({
        predicate: ({ queryKey }) =>
          queryKey[0] === "haston" &&
          ["account", "profile", "orders", "wishlist", "session"].includes(String(queryKey[1])),
      });
      await navigate({ to: "/login", replace: true });
    }
  };

  if (!session) {
    return null;
  }

  const displayName = session.name || session.email;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
      <PageHero
        eyebrow="Account"
        title={`Welcome back, ${displayName}.`}
        breadcrumb={[{ label: "Account" }]}
      />
      <section className="mx-auto max-w-[1600px] px-6 py-10 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside>
            <div className="rounded-md border border-border bg-card p-6 soft-shadow">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-display text-xl">{initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{displayName}</p>
                  <p className="truncate text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                    Member since 2022
                  </p>
                </div>
              </div>
              <nav className="mt-6 flex flex-col gap-1">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex items-center justify-between rounded px-3 py-2.5 text-left text-[11px] uppercase tracking-[0.24em] transition-colors ${
                      tab === t.key ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <t.icon className="h-4 w-4" strokeWidth={1.4} /> {t.label}
                    </span>
                    <ChevronRight className="h-3 w-3 opacity-40" />
                  </button>
                ))}
                <button
                  onClick={signOut}
                  disabled={signingOut}
                  className="mt-3 flex items-center gap-3 rounded px-3 py-2.5 text-left text-[11px] uppercase tracking-[0.24em] text-muted-foreground hover:bg-muted disabled:cursor-wait disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.4} />
                  {signingOut ? "Signing out" : "Sign out"}
                </button>
              </nav>
            </div>
          </aside>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {tab === "overview" && <Overview />}
                {tab === "orders" && <Orders />}
                {tab === "wishlist" && <WishlistTab />}
                {tab === "addresses" && <Addresses name={displayName} />}
                {tab === "wallet" && (
                  <PanelCard
                    title="Wallet"
                    body="Store credit: ₹15,300 — from your recent return."
                  />
                )}
                {tab === "loyalty" && <Loyalty />}
                {tab === "notifications" && (
                  <PanelCard
                    title="Notifications"
                    body="Manage which updates arrive in your inbox."
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}

function Overview() {
  const stats = [
    { label: "Member benefits", value: "10% off" },
    { label: "Orders", value: "14" },
    { label: "Loyalty tier", value: "Atelier" },
    { label: "Store credit", value: "₹15,300" },
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border border-border bg-card p-6 soft-shadow">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-3 text-display text-3xl">{s.value}</p>
          </div>
        ))}
      </div>
      <Orders />
    </div>
  );
}

function Orders() {
  const session = useHastonSession();
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["haston", "orders"],
    queryFn: hastonApi.orders,
    enabled: Boolean(session),
  });
  return (
    <div>
      <h2 className="text-display text-2xl">Recent orders</h2>
      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading your orders...</p>}
      {error && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Unable to load your orders."}
        </p>
      )}
      {!isLoading && !error && orders.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">You have no orders yet.</p>
      )}
      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <Link
            key={o.id}
            to="/order-details/$id"
            params={{ id: String(o.id) }}
            className="block rounded-md border border-border bg-card p-6 soft-shadow transition-shadow hover:soft-shadow"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  Order
                </p>
                <p className="mt-1 text-display text-lg">HV-{o.id}</p>
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })
                    : "Recent order"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">{inr(o.totalPrice)}</p>
                <p
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.28em] ${o.status === "Delivered" ? "bg-accent/20 text-accent" : "bg-mustard/25 text-graphite"}`}
                >
                  {o.status}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              {o.items.map((item) => (
                <img
                  key={item.id}
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-20 w-16 rounded object-cover"
                />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function WishlistTab() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
      {PRODUCTS.slice(0, 6).map((p) => (
        <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="group">
          <div className="overflow-hidden rounded">
            <img
              src={p.image}
              alt={p.name}
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <p className="mt-3 text-display text-lg">{p.name}</p>
          <p className="text-xs">{inr(p.price)}</p>
        </Link>
      ))}
    </div>
  );
}

function Addresses({ name }: { name: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {["Home — Milano", "Studio — London"].map((t, i) => (
        <div key={i} className="rounded-md border border-border bg-card p-6 soft-shadow">
          <p className="text-eyebrow text-muted-foreground">{t}</p>
          <p className="mt-4 text-sm leading-relaxed">
            {name}
            <br />
            Via della Spiga 27
            <br />
            20121 Milano, Italy
            <br />
            +39 02 7600 1234
          </p>
          <div className="mt-4 flex gap-3 text-[10px] uppercase tracking-[0.28em]">
            <button className="underline">Edit</button>
            <button className="text-muted-foreground">Set default</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Loyalty() {
  return (
    <div className="rounded-md bg-primary p-10 text-primary-foreground luxe-shadow">
      <p className="text-eyebrow opacity-70">Loyalty · Atelier tier</p>
      <p className="mt-4 text-display text-4xl">2,480 points</p>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-primary-foreground/15">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "62%" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full bg-accent"
        />
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.28em] opacity-70">
        1,520 to Maison tier
      </p>
    </div>
  );
}

function PanelCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-8 soft-shadow">
      <p className="text-eyebrow text-muted-foreground">{title}</p>
      <p className="mt-4 text-sm leading-relaxed">{body}</p>
    </div>
  );
}
