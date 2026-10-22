import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { IMG } from "@/lib/haston-data";
import { hastonApi } from "@/lib/haston-api";
import { phoneAuthApi } from "@/lib/phone-auth-api";
import { saveSession } from "@/lib/haston-session";

const PHONE_RULES: Record<string, RegExp> = {
  "+91": /^[6-9]\d{9}$/,
  "+1": /^[2-9]\d{9}$/,
  "+44": /^7\d{9}$/,
  "+61": /^4\d{8}$/,
};

const getPhoneE164 = (countryCode: string, value: string) => {
  const rule = PHONE_RULES[countryCode];
  if (!rule) return null;
  let nationalNumber = value.replace(/\D/g, "");
  if (countryCode !== "+1" && nationalNumber.startsWith("0")) {
    nationalNumber = nationalNumber.slice(1);
  }
  return rule.test(nationalNumber) ? `${countryCode}${nationalNumber}` : null;
};

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
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [phoneStage, setPhoneStage] = useState<"number" | "otp">("number");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [requestedPhone, setRequestedPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneNotice, setPhoneNotice] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const validateDetails = () => {
    const nextErrors: Partial<Record<keyof typeof details, string>> = {};
    if (!details.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!details.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (details.password.length < 8)
      nextErrors.password = "Password must be at least 8 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

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

  const submitPhone = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    if (!validateDetails()) return;

    if (phoneStage === "number") {
      const phoneNumber = getPhoneE164(countryCode, phone);
      if (!phoneNumber) {
        setPhoneError("Enter a valid mobile number for the selected country.");
        return;
      }
      setPhoneError("");
      setSubmitting(true);
      try {
        const response = await phoneAuthApi.sendRegistrationOtp(phoneNumber);
        if (!response || typeof response.message !== "string" || !response.message.trim()) {
          throw new Error("HASTON did not confirm the verification code request.");
        }
        setRequestedPhone(phoneNumber);
        setPhoneStage("otp");
        setOtp("");
        setResendCooldown(30);
        setPhoneNotice(response.message.trim());
      } catch (error) {
        setPhoneNotice("");
        setSubmitError(error instanceof Error ? error.message : "Unable to send a verification code.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!/^\d{4,8}$/.test(otp.trim())) {
      setPhoneError("Enter the verification code sent to your phone.");
      return;
    }
    setPhoneError("");
    setSubmitting(true);
    try {
      const response = await phoneAuthApi.verifyRegistrationOtp({
        phone: requestedPhone,
        otp: otp.trim(),
        name: `${details.firstName.trim()} ${details.lastName.trim()}`,
        email: details.email.trim(),
        password: details.password,
      });
      saveSession(response.user);
      await navigate({ to: "/account", replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = window.setTimeout(() => {
      setResendCooldown((remaining) => Math.max(0, remaining - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  const resendOtp = async () => {
    if (resendCooldown > 0 || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await phoneAuthApi.sendRegistrationOtp(requestedPhone);
      if (!response || typeof response.message !== "string" || !response.message.trim()) {
        throw new Error("HASTON did not confirm the verification code request.");
      }
      setResendCooldown(30);
      setPhoneNotice(response.message.trim());
    } catch (error) {
      setPhoneNotice("");
      setSubmitError(error instanceof Error ? error.message : "Unable to send a verification code.");
    } finally {
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
          onSubmit={(event) => {
            if (mode === "phone") void submitPhone(event);
            else void submit(event);
          }}
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
          <div className="mt-6 flex border-b border-border text-[10px] uppercase tracking-[0.18em]">
            <button
              type="button"
              aria-pressed={mode === "email"}
              onClick={() => {
                setMode("email");
                setSubmitError("");
                setPhoneNotice("");
              }}
              className={`flex-1 border-b-2 px-3 py-3 transition-colors ${mode === "email" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`}
            >
              Email and password
            </button>
            <button
              type="button"
              aria-pressed={mode === "phone"}
              onClick={() => {
                setMode("phone");
                setSubmitError("");
                setPhoneNotice("");
              }}
              className={`flex-1 border-b-2 px-3 py-3 transition-colors ${mode === "phone" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`}
            >
              Phone OTP
            </button>
          </div>
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
            {mode === "phone" && (
              <>
                <div>
                  <label htmlFor="register-phone" className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Mobile number
                  </label>
                  <div className="mt-2 flex border-b border-border focus-within:border-primary">
                    <select
                      aria-label="Country calling code"
                      value={countryCode}
                      disabled={phoneStage === "otp"}
                      onChange={(event) => setCountryCode(event.target.value)}
                      className="max-w-[135px] bg-transparent py-3 pr-2 text-sm text-primary focus:outline-none"
                    >
                      <option value="+91">India (+91)</option>
                      <option value="+1">United States (+1)</option>
                      <option value="+44">United Kingdom (+44)</option>
                      <option value="+61">Australia (+61)</option>
                    </select>
                    <input
                      id="register-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={phoneStage === "otp" ? requestedPhone : phone}
                      disabled={phoneStage === "otp"}
                      onChange={(event) => {
                        setPhone(event.target.value);
                        setPhoneError("");
                      }}
                      aria-invalid={Boolean(phoneError)}
                      className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-primary outline-none"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                {phoneStage === "otp" && (
                  <div>
                    <label htmlFor="register-phone-otp" className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      Verification code
                    </label>
                    <input
                      id="register-phone-otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={otp}
                      onChange={(event) => {
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 8));
                        setPhoneError("");
                      }}
                      aria-invalid={Boolean(phoneError)}
                      className="mt-2 block w-full border-b border-border bg-transparent px-1 py-3 text-sm text-primary outline-none focus:border-primary"
                      placeholder="Enter code"
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {phoneError && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {phoneError}
            </p>
          )}
          {phoneNotice && mode === "phone" && (
            <p role="status" aria-live="polite" className="mt-4 text-sm text-primary">
              {phoneNotice}
            </p>
          )}
          {submitError && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {submitError}
            </p>
          )}
          {mode === "phone" && phoneStage === "otp" && (
            <div className="mt-5 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={submitting || resendCooldown > 0}
                onClick={() => void resendOtp()}
                className="text-[10px] uppercase tracking-[0.16em] text-primary underline underline-offset-4 disabled:text-muted-foreground"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhoneStage("number");
                  setRequestedPhone("");
                  setOtp("");
                  setPhoneError("");
                  setSubmitError("");
                  setPhoneNotice("");
                }}
                className="text-[10px] uppercase tracking-[0.16em] text-primary underline underline-offset-4"
              >
                Change number
              </button>
            </div>
          )}
          <LuxeButton className="mt-8 w-full" arrow type="submit" disabled={submitting}>
            {submitting
              ? phoneStage === "otp" && mode === "phone"
                ? "Verifying code"
                : "Creating account"
              : mode === "phone"
                ? phoneStage === "otp"
                  ? "Verify & create account"
                  : "Send OTP"
                : "Create account"}
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
