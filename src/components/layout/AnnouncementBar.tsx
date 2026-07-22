import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Truck, RotateCcw, Wallet, ShieldCheck } from "lucide-react";

const offers = [
  { icon: Truck, text: "Free Shipping on orders above ₹999" },
  { icon: RotateCcw, text: "Easy 7-day Returns & Exchanges" },
  { icon: Wallet, text: "Cash on Delivery available" },
  { icon: ShieldCheck, text: "100% Secure Payments" },
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % offers.length), 3800);
    return () => clearInterval(t);
  }, []);
  const Item = offers[i];
  return (
    <div className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-center px-6 md:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.32em]"
          >
            <Item.icon className="h-3.5 w-3.5 opacity-80" strokeWidth={1.6} />
            <span>{Item.text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
