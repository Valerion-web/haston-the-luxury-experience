import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { IMG } from "@/lib/haston-data";
import { hastonApi } from "@/lib/haston-api";
import { saveSession } from "@/lib/haston-session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — HASTON" },
      { name: "description", content: "Access your HASTON account." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailError("Enter a valid email address.");
      setError("");
      return;
    }
    setEmailError("");
    if (!password) {
      setPasswordError("Enter your password to continue.");
      return;
    }
    setPasswordError("");

    setSubmitting(true);
    try {
      const response = await hastonApi.login(normalizedEmail, password);
      saveSession(response.user);
      const isAdminRole = response.user.role === "ADMIN" || response.user.role === "SUPER_ADMIN";
      await navigate({ to: isAdminRole ? "/admin" : "/account", replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitPhone = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) {
      setPhoneError("Enter a valid phone number.");
      return;
    }
    setPhoneError("");
    setError(
      "Phone verification is not available yet. This storefront has no phone OTP request or verification service configured.",
    );
  };

  const switchMode = (nextMode: "email" | "phone") => {
    setMode(nextMode);
    setError("");
    setEmailError("");
    setPhoneError("");
  };

  return (
    <div className="grid grid-cols-1 md:min-h-[calc(100svh-120px)] md:grid-cols-2">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-[170px] overflow-hidden md:h-auto md:min-h-[620px]"
      >
        <img
          src={IMG.hero}
          alt="HASTON menswear editorial"
          className="h-full w-full object-cover object-[center_42%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-primary-foreground md:p-12">
          <Link to="/" className="text-display text-2xl tracking-[0.3em]">
            HASTON
          </Link>
          <div className="max-w-md">
            <p className="text-eyebrow opacity-80">The house</p>
            <p className="mt-2 text-display text-xl leading-[1.2] md:mt-4 md:text-3xl md:leading-[1.1]">
              A quieter kind of luxury. Kept just for members.
            </p>
          </div>
        </div>
      </motion.div>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10 md:px-12 lg:px-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px]"
        >
          {mode === "email" ? (
            <motion.div
              key="email"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
            >
              <p className="text-eyebrow text-muted-foreground">Welcome back</p>
              <h1 className="mt-4 text-display text-4xl">Sign in.</h1>
              <p className="mt-4 text-sm text-muted-foreground">
                Access orders, saved pieces and private previews.
              </p>

              <form onSubmit={submit} noValidate>
                <div className="mt-8 space-y-6">
                  <Input
                    id="login-email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    error={emailError}
                    onChange={(value) => {
                      setEmail(value);
                      setEmailError("");
                      setError("");
                    }}
                  />
                  <Input
                    id="login-password"
                    label="Password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    error={passwordError}
                    onChange={(value) => {
                      setPassword(value);
                      setPasswordError("");
                      setError("");
                    }}
                    trailingAction={
                      <button
                        type="button"
                        onClick={() => setPasswordVisible((visible) => !visible)}
                        aria-label={passwordVisible ? "Hide password" : "Show password"}
                        className="rounded-sm p-2 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
                      >
                        {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    }
                  />
                  <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.2em]">
                    <label className="flex cursor-pointer items-center gap-2.5 text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                        className="h-4 w-4 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      />
                      Remember me
                    </label>
                    <Link
                      to="/support"
                      title="Contact HASTON support for password assistance"
                      className="rounded-sm underline decoration-sand underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
                    >
                      Forgot?
                    </Link>
                  </div>
                </div>

                {error && <StatusMessage>{error}</StatusMessage>}

                <LuxeButton
                  className="mt-7 w-full"
                  arrow
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? "Signing in" : "Sign in"}
                </LuxeButton>
              </form>

              <Divider />

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setError(
                      "Google sign-in is not configured for this storefront. Email sign-in is available.",
                    )
                  }
                  className="flex h-12 items-center justify-center gap-3 border border-border px-3 text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-primary/50 hover:bg-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none sm:text-[10px]"
                >
                  <GoogleMark />
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("phone")}
                  className="flex h-12 items-center justify-center gap-2 border border-border px-3 text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-primary/50 hover:bg-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none sm:text-[10px]"
                >
                  <Phone size={15} strokeWidth={1.6} aria-hidden="true" />
                  Continue with phone
                </button>
              </div>

              <p className="mt-8 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px] sm:tracking-[0.24em]">
                New here?{" "}
                <Link
                  to="/register"
                  className="text-primary underline decoration-sand underline-offset-4 transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
                >
                  Create an account
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="phone"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.32 }}
            >
              <button
                type="button"
                onClick={() => switchMode("email")}
                className="mb-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
              >
                <ArrowLeft size={15} aria-hidden="true" />
                Back to email sign-in
              </button>
              <p className="text-eyebrow text-muted-foreground">Private access</p>
              <h1 className="mt-4 text-display text-3xl sm:text-4xl">Sign in with your phone.</h1>
              <p className="mt-4 text-sm text-muted-foreground">
                We'll send a verification code to your mobile number.
              </p>

              <form onSubmit={submitPhone} noValidate>
                <div className="mt-8">
                  <label htmlFor="login-phone" className="text-eyebrow text-muted-foreground">
                    Mobile number
                  </label>
                  <div className="mt-2 flex items-stretch border-b border-border transition-colors focus-within:border-primary">
                    <select
                      aria-label="Country calling code"
                      value={countryCode}
                      onChange={(event) => setCountryCode(event.target.value)}
                      className="max-w-[125px] bg-transparent py-3 pr-2 text-sm text-primary focus:outline-none"
                    >
                      <option value="+91">India (+91)</option>
                      <option value="+1">United States (+1)</option>
                      <option value="+44">United Kingdom (+44)</option>
                      <option value="+61">Australia (+61)</option>
                    </select>
                    <input
                      id="login-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value);
                        setPhoneError("");
                        setError("");
                      }}
                      aria-invalid={Boolean(phoneError)}
                      aria-describedby={phoneError ? "login-phone-error" : undefined}
                      placeholder="Phone number"
                      className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-primary outline-none placeholder:text-muted-foreground/70"
                    />
                  </div>
                  {phoneError && (
                    <p id="login-phone-error" className="mt-2 text-xs text-destructive">
                      {phoneError}
                    </p>
                  )}
                </div>

                {error && <StatusMessage>{error}</StatusMessage>}

                <LuxeButton className="mt-8 w-full" arrow type="submit">
                  Send OTP
                </LuxeButton>
              </form>
            </motion.div>
          )}
        </motion.div>
      </section>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-7 flex items-center gap-4 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      Or
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function StatusMessage({ children }: { children: string }) {
  return (
    <p role="status" aria-live="polite" className="mt-4 text-sm leading-relaxed text-destructive">
      {children}
    </p>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-[17px] w-[17px] shrink-0">
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.9 6-15Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.9 1.3-4.1 2.1-6.8 2.1-5.2 0-9.6-3.5-11.2-8.2H5.9v5.2A20 20 0 0 0 24 44Z"
      />
      <path fill="#FBBC05" d="M12.8 27.9a12 12 0 0 1 0-7.8v-5.2H5.9a20 20 0 0 0 0 18.2l6.9-5.2Z" />
      <path
        fill="#EA4335"
        d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.9 29.5 4 24 4A20 20 0 0 0 5.9 14.9l6.9 5.2c1.6-4.7 6-8.2 11.2-8.2Z"
      />
    </svg>
  );
}

function Input({
  id,
  label,
  type,
  autoComplete,
  value,
  error,
  onChange,
  trailingAction,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  value: string;
  error: string;
  onChange: (value: string) => void;
  trailingAction?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-eyebrow text-muted-foreground">
        {label}
      </label>
      <div className="mt-1 flex items-center border-b border-border transition-colors focus-within:border-primary motion-reduce:transition-none">
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-primary outline-none placeholder:text-muted-foreground/70"
        />
        {trailingAction}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
