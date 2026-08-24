import { Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";

export function AppPromo() {
  return (
    <section className="border-y border-border bg-secondary/20">
      <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-10">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-eyebrow text-muted-foreground">The HASTON app</p>
            <h2 className="mt-2 text-display text-2xl">The house, in your pocket.</h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Private previews, wardrobe notes and considered shopping wherever your day takes you.
            </p>
          </div>
        </div>
        <motion.div whileHover={{ y: -2 }}>
          <LuxeButton variant="outline" arrow>
            Download the app
          </LuxeButton>
        </motion.div>
      </div>
    </section>
  );
}
