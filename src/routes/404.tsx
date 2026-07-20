import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";

export const Route = createFileRoute("/404")({
  head: () => ({ meta: [{ title: "Not found — HASTON" }, { name: "robots", content: "noindex" }] }),
  component: NotFound,
});

function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center px-6 text-center">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-eyebrow text-muted-foreground"
        >
          Error 404
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-display text-[clamp(5rem,15vw,12rem)] leading-none"
        >
          Lost in transit.
        </motion.h1>
        <p className="mx-auto mt-6 max-w-md text-muted-foreground">
          The page you're looking for has been altered or archived.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <LuxeButton to="/" arrow>
            Return home
          </LuxeButton>
          <Link
            to="/collections"
            className="rounded-full border border-border px-8 py-4 text-[11px] uppercase tracking-[0.28em]"
          >
            Browse collections
          </Link>
        </div>
      </div>
    </section>
  );
}
