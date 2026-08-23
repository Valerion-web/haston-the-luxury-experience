import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { IMG } from "@/lib/haston-data";
import { hastonApi } from "@/lib/haston-api";
import { saveSession } from "@/lib/haston-session";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — HASTON" },
      { name: "description", content: "Create a HASTON account." },
    ],
  }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof details, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    const nextErrors: Partial<Record<keyof typeof details, string>> = {};
    if (!details.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!details.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (details.password.length < 8)
      nextErrors.password = "Password must be at least 8 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await hastonApi.register(
        `${details.firstName.trim()} ${details.lastName.trim()}`,
        details.email.trim(),
        details.password,
      );
      saveSession(response.token, response.user);
      await navigate({ to: "/account", replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create your account.");
      setSubmitting(false);
    }
  };

  const update = (field: keyof typeof details, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    if (submitError) setSubmitError("");
  };

  return (
    <div className="grid min-h-[85vh] grid-cols-1 md:grid-cols-2">
      <div className="grid place-items-center px-6 py-10 md:px-16 md:order-2">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <p className="text-eyebrow text-muted-foreground">Join the house</p>
          <h1 className="mt-4 text-display text-4xl md:text-3xl">Create account.</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Private previews, invitations and lifetime alterations.
          </p>
          <div className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="First name"
                value={details.firstName}
                error={errors.firstName}
                onChange={(value) => update("firstName", value)}
              />
              <Input
                label="Last name"
                value={details.lastName}
                error={errors.lastName}
                onChange={(value) => update("lastName", value)}
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={details.email}
              error={errors.email}
              onChange={(value) => update("email", value)}
            />
            <Input
              label="Password"
              type="password"
              value={details.password}
              error={errors.password}
              onChange={(value) => update("password", value)}
            />
            <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              <input type="checkbox" className="accent-primary" /> I'd like letters from the atelier
            </label>
          </div>
          {submitError && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {submitError}
            </p>
          )}
          <LuxeButton className="mt-8 w-full" arrow type="submit" disabled={submitting}>
            {submitting ? "Creating account" : "Create account"}
          </LuxeButton>
          <p className="mt-6 text-center text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Have an account?{" "}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </p>
        </motion.form>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden overflow-hidden md:block"
      >
        <img src={IMG.lb2} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-primary/10" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="text-display text-2xl tracking-[0.3em]">
            HASTON
          </Link>
          <div>
            <p className="text-eyebrow opacity-70">Membership</p>
            <p className="mt-4 max-w-md text-display text-3xl leading-[1.1]">
              Fewer, better pieces — kept in your closet, and in your name.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
function Input({
  label,
  type = "text",
  value,
  error,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${label.toLowerCase().replace(/\s+/g, "-")}-error` : undefined}
        className={`mt-2 block w-full border-b bg-transparent px-1 py-3 text-sm transition-colors focus:border-primary focus:outline-none ${error ? "border-destructive" : "border-border"}`}
      />
      {error && (
        <span
          id={`${label.toLowerCase().replace(/\s+/g, "-")}-error`}
          className="mt-1 block text-xs text-destructive"
        >
          {error}
        </span>
      )}
    </label>
  );
}
