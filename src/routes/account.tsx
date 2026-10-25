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
  Plus,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import { inr } from "@/lib/haston-data";
import { ProductCard } from "@/components/ui-haston/ProductCard";
import { hastonApi, type SavedAddress, type SavedAddressInput } from "@/lib/haston-api";
import { clearSession } from "@/lib/haston-session";
import { useHastonSession } from "@/hooks/use-haston-session";
import { useHastonWishlist } from "@/hooks/use-haston-wishlist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
          ["account", "addresses", "cart", "profile", "orders", "wishlist", "session"].includes(String(queryKey[1])),
      });
      await navigate({ to: "/login", replace: true });
    }
  };

  if (!session) {
    return null;
  }

  const displayName = session.name || session.email || "HASTON member";
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
  const { items, isLoading, error } = useHastonWishlist();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading your wishlist...</p>;
  }
  if (error) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Unable to load your wishlist right now.
      </p>
    );
  }
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing saved yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
      {items.map((item, index) => (
        <ProductCard key={item.id} product={item.product} index={index} />
      ))}
    </div>
  );
}

function Addresses({ name }: { name: string }) {
  const session = useHastonSession();
  const queryClient = useQueryClient();
  const queryKey = ["haston", "addresses", session?.id] as const;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [form, setForm] = useState<SavedAddressInput>(() => emptyAddress(name));
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SavedAddressInput, string>>>({});
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    data: addresses = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: hastonApi.addresses,
    enabled: Boolean(session),
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, address }: { id: number | null; address: SavedAddressInput }) =>
      id === null ? hastonApi.createAddress(address) : hastonApi.updateAddress(id, address),
    onSuccess: async (_address, { id }) => {
      setIsFormOpen(false);
      setEditingAddressId(null);
      setFieldErrors({});
      setFeedback({
        type: "success",
        message: id === null ? "Address added successfully." : "Address updated successfully.",
      });
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: (mutationError) => {
      setFeedback({
        type: "error",
        message: mutationError instanceof Error ? mutationError.message : "Unable to save this address.",
      });
    },
  });

  const defaultMutation = useMutation({
    mutationFn: async (id: number) => {
      await hastonApi.setDefaultAddress(id);
      const persistedAddresses = await hastonApi.addresses();
      const defaultAddresses = persistedAddresses.filter((address) => address.isDefault);
      if (defaultAddresses.length !== 1 || defaultAddresses[0].id !== id) {
        throw new Error("The server did not confirm this address as the only default.");
      }
      return persistedAddresses;
    },
    onSuccess: (persistedAddresses) => {
      queryClient.setQueryData<SavedAddress[]>(queryKey, persistedAddresses);
      setFeedback({ type: "success", message: "Default address updated." });
    },
    onError: async (mutationError) => {
      setFeedback({
        type: "error",
        message: mutationError instanceof Error ? mutationError.message : "Unable to update the default address.",
      });
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => hastonApi.deleteAddress(id),
    onSuccess: async (_result, id) => {
      queryClient.setQueryData<SavedAddress[]>(queryKey, (current) =>
        current?.filter((address) => address.id !== id),
      );
      setFeedback({ type: "success", message: "Address deleted successfully." });
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: (mutationError) => {
      setFeedback({
        type: "error",
        message: mutationError instanceof Error ? mutationError.message : "Unable to delete this address.",
      });
    },
  });

  const isMutating = saveMutation.isPending || defaultMutation.isPending || deleteMutation.isPending;

  const startNewAddress = () => {
    setEditingAddressId(null);
    setForm(emptyAddress(name));
    setFieldErrors({});
    setFeedback(null);
    setIsFormOpen(true);
  };

  const startEditingAddress = (address: SavedAddress) => {
    setEditingAddressId(address.id);
    setForm({
      label: address.label,
      name: address.name || name,
      line1: address.line1,
      line2: address.line2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || "",
    });
    setFieldErrors({});
    setFeedback(null);
    setIsFormOpen(true);
  };

  const cancelForm = () => {
    setIsFormOpen(false);
    setEditingAddressId(null);
    setFieldErrors({});
    setFeedback(null);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isMutating) return;
    const errors = validateSavedAddress(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setFeedback(null);
    saveMutation.mutate({
      id: editingAddressId,
      address: {
        label: form.label.trim(),
        name: form.name.trim(),
        line1: form.line1.trim(),
        line2: form.line2?.trim() || null,
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
        phone: form.phone?.trim() || null,
      },
    });
  };

  const handleDelete = (address: SavedAddress) => {
    if (isMutating || !window.confirm(`Delete ${address.label}? This cannot be undone.`)) return;
    setFeedback(null);
    deleteMutation.mutate(address.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-display text-2xl">Saved addresses</h2>
          <p className="mt-2 text-sm text-muted-foreground">Manage where your HASTON orders arrive.</p>
        </div>
        <button
          type="button"
          onClick={startNewAddress}
          disabled={isMutating}
          className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" /> Add address
        </button>
      </div>

      {feedback && (
        <p
          role={feedback.type === "error" ? "alert" : "status"}
          className={`text-sm ${feedback.type === "error" ? "text-destructive" : "text-accent"}`}
        >
          {feedback.message}
        </p>
      )}

      {isLoading ? (
        <p role="status" className="text-sm text-muted-foreground">Loading saved addresses...</p>
      ) : error ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-5">
          <p role="alert" className="text-sm text-destructive">Unable to load saved addresses.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="text-[10px] uppercase tracking-[0.22em] underline underline-offset-4"
          >
            Retry
          </button>
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-md border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">You have no saved addresses yet.</p>
          <button
            type="button"
            onClick={startNewAddress}
            disabled={isMutating}
            className="mt-4 text-[10px] uppercase tracking-[0.22em] underline underline-offset-4 disabled:opacity-50"
          >
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article key={address.id} className="rounded-md border border-border bg-card p-6 soft-shadow">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-eyebrow text-muted-foreground">{address.label}</p>
                {address.isDefault && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1 text-[9px] uppercase tracking-[0.2em]">
                    <Check className="h-3 w-3" /> Default
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm leading-relaxed">
                {address.name || name}
                <br />
                {address.line1}
                {address.line2 && <><br />{address.line2}</>}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
                {address.phone && <><br />{address.phone}</>}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.22em]">
                <button
                  type="button"
                  onClick={() => startEditingAddress(address)}
                  disabled={isMutating}
                  className="inline-flex items-center gap-1.5 underline underline-offset-4 disabled:opacity-50"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => { setFeedback(null); defaultMutation.mutate(address.id); }}
                    disabled={isMutating}
                    className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    Set default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(address)}
                  disabled={isMutating}
                  className="inline-flex items-center gap-1.5 text-destructive disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={handleSave} noValidate className="rounded-md border border-border bg-card p-5 md:p-6">
          <h3 className="text-display text-xl">{editingAddressId === null ? "Add address" : "Edit address"}</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {ADDRESS_FIELDS.map((field) => {
              const errorMessage = fieldErrors[field.name];
              const inputId = `saved-address-${field.name}`;
              return (
                <label key={field.name} htmlFor={inputId} className="block">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    {field.label}{field.required ? " *" : ""}
                  </span>
                  <input
                    id={inputId}
                    type={field.type || "text"}
                    autoComplete={field.autoComplete}
                    required={field.required}
                    value={form[field.name] ?? ""}
                    onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                    aria-invalid={Boolean(errorMessage)}
                    aria-describedby={errorMessage ? `${inputId}-error` : undefined}
                    className={`mt-2 block w-full rounded-md border bg-transparent px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none ${errorMessage ? "border-destructive" : "border-border"}`}
                  />
                  {errorMessage && <span id={`${inputId}-error`} className="mt-1 block text-xs text-destructive">{errorMessage}</span>}
                </label>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isMutating}
              className="rounded-full bg-primary px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-primary-foreground disabled:cursor-wait disabled:opacity-50"
            >
              {saveMutation.isPending ? "Saving..." : editingAddressId === null ? "Save address" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              disabled={isMutating}
              className="rounded-full border border-border px-5 py-3 text-[10px] uppercase tracking-[0.22em] disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

const ADDRESS_FIELDS: Array<{
  name: keyof SavedAddressInput;
  label: string;
  required: boolean;
  type?: "text" | "tel";
  autoComplete?: string;
}> = [
  { name: "label", label: "Address label", required: true },
  { name: "name", label: "Full name", required: true, autoComplete: "name" },
  { name: "line1", label: "Address line 1", required: true, autoComplete: "address-line1" },
  { name: "line2", label: "Address line 2", required: false, autoComplete: "address-line2" },
  { name: "city", label: "City", required: true, autoComplete: "address-level2" },
  { name: "state", label: "State", required: true, autoComplete: "address-level1" },
  { name: "postalCode", label: "Postal code", required: true, autoComplete: "postal-code" },
  { name: "country", label: "Country", required: true, autoComplete: "country-name" },
  { name: "phone", label: "Mobile phone (optional)", required: false, type: "tel", autoComplete: "tel-national" },
];

const emptyAddress = (name: string): SavedAddressInput => ({
  label: "",
  name,
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
});

function validateSavedAddress(address: SavedAddressInput) {
  const errors: Partial<Record<keyof SavedAddressInput, string>> = {};
  const requiredFields: Array<keyof SavedAddressInput> = [
    "label",
    "name",
    "line1",
    "city",
    "state",
    "postalCode",
    "country",
  ];
  for (const field of requiredFields) {
    if (!address[field]?.trim()) errors[field] = "This field is required.";
  }
  if (address.postalCode.trim() && !/^\d{6}$/.test(address.postalCode.trim())) {
    errors.postalCode = "Enter a valid 6-digit PIN code.";
  }
  const phone = address.phone?.trim() || "";
  if (phone && !/^[6-9]\d{9}$/.test(phone)) {
    errors.phone = "Enter a valid 10-digit mobile number.";
  }
  return errors;
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
