import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/ui-haston/PageHero";
import { LuxeButton } from "@/components/ui-haston/LuxeButton";
import { Mail, Phone, MessageSquare, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — HASTON" }, { name: "description", content: "Reach the HASTON client service team." }] }),
  component: Contact,
});

const channels = [
  { icon: Mail, title: "Email", body: "client@haston.house", note: "Replies within 24h" },
  { icon: Phone, title: "Phone", body: "+39 02 7600 1234", note: "Mon–Sat, 10–19 CET" },
  { icon: MessageSquare, title: "Concierge", body: "Chat with a stylist", note: "Live in every store" },
  { icon: MapPin, title: "Head office", body: "Via della Spiga 27, Milano", note: "By appointment" },
];

function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Speak with the house." description="Client service, stylists and a private line for members." breadcrumb={[{ label: "Contact" }]} />
      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {channels.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="rounded-md border border-border bg-card p-6 soft-shadow"
              >
                <c.icon className="h-5 w-5 text-accent" strokeWidth={1.4} />
                <p className="mt-6 text-eyebrow">{c.title}</p>
                <p className="mt-2 text-display text-2xl">{c.body}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{c.note}</p>
              </motion.div>
            ))}
          </div>

          <form className="rounded-md border border-border bg-card p-8 soft-shadow">
            <p className="text-eyebrow">Send a message</p>
            <div className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Name" />
                <Input label="Email" type="email" />
              </div>
              <Input label="Subject" />
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Message</span>
                <textarea rows={5} className="mt-2 block w-full resize-none rounded-md border border-border bg-transparent px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none" />
              </label>
            </div>
            <LuxeButton className="mt-8" arrow>Send message</LuxeButton>
          </form>
        </div>
      </section>
    </>
  );
}

function Input({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
      <input type={type} className="mt-2 block w-full rounded-md border border-border bg-transparent px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none" />
    </label>
  );
}
