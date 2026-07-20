import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { IMG } from "@/lib/haston-data";

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
  return (
    <div className="grid min-h-[85vh] grid-cols-1 md:grid-cols-2">
      <div className="grid place-items-center px-6 py-16 md:px-16 md:order-2">
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <p className="text-eyebrow text-muted-foreground">Join the house</p>
          <h1 className="mt-4 text-display text-4xl md:text-5xl">Create account.</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Private previews, invitations and lifetime alterations.
          </p>
          <div className="mt-10 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="First name" />
              <Input label="Last name" />
            </div>
            <Input label="Email" type="email" />
            <Input label="Password" type="password" />
            <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              <input type="checkbox" className="accent-primary" /> I'd like letters from the atelier
            </label>
          </div>
          <LuxeButton className="mt-8 w-full" arrow>
            Create account
          </LuxeButton>
          <p className="mt-10 text-center text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
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
function Input({ label, type = "text" }: { label: string; type?: string }) {
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
