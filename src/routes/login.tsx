import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { IMG } from "@/lib/haston-data";

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
  return (
    <div className="grid min-h-[85vh] grid-cols-1 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden overflow-hidden md:block"
      >
        <img src={IMG.hero} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary/20" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="text-display text-2xl tracking-[0.3em]">
            HASTON
          </Link>
          <div>
            <p className="text-eyebrow opacity-70">The house</p>
            <p className="mt-4 max-w-md text-display text-3xl leading-[1.1]">
              A quieter kind of luxury. Kept just for members.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid place-items-center px-6 py-16 md:px-16">
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <p className="text-eyebrow text-muted-foreground">Welcome back</p>
          <h1 className="mt-4 text-display text-4xl md:text-5xl">Sign in.</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Access orders, saved pieces and private previews.
          </p>

          <div className="mt-10 space-y-5">
            <Input label="Email" type="email" />
            <Input label="Password" type="password" />
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em]">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-primary" /> Remember me
              </label>
              <Link to="/login" className="underline">
                Forgot?
              </Link>
            </div>
          </div>

          <LuxeButton className="mt-8 w-full" arrow>
            Sign in
          </LuxeButton>

          <div className="my-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> Or <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button className="rounded-full border border-border py-3 text-[11px] uppercase tracking-[0.24em] transition-colors hover:bg-muted">
              Continue with Google
            </button>
            <button className="rounded-full border border-border py-3 text-[11px] uppercase tracking-[0.24em] transition-colors hover:bg-muted">
              Continue with Apple
            </button>
          </div>

          <p className="mt-10 text-center text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="underline">
              Create an account
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}

function Input({ label, type }: { label: string; type: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
      <input
        type={type}
        className="mt-2 block w-full border-b border-border bg-transparent px-1 py-3 text-sm transition-colors focus:border-primary focus:outline-none"
      />
    </label>
  );
}
