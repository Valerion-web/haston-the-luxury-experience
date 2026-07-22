import { Link } from "@tanstack/react-router";
import { Package, MapPin, Headphones, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

export function UtilityNav() {
  const [lang, setLang] = useState("EN");
  const [country, setCountry] = useState("IN ₹");

  return (
    <div className="hidden border-b border-border/50 bg-card/40 md:block">
      <div className="mx-auto flex h-8 max-w-[1600px] items-center justify-between px-6 text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:px-10">
        <div className="flex items-center gap-6">
          <Link to="/order-tracking" className="flex items-center gap-1.5 hover:text-foreground">
            <Package className="h-3 w-3" /> Track Order
          </Link>
          <Link to="/store-locator" className="flex items-center gap-1.5 hover:text-foreground">
            <MapPin className="h-3 w-3" /> Store Locator
          </Link>
          <Link to="/support" className="flex items-center gap-1.5 hover:text-foreground">
            <Headphones className="h-3 w-3" /> Customer Support
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Globe className="h-3 w-3" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="cursor-pointer appearance-none bg-transparent pr-3 uppercase tracking-[0.28em] outline-none"
              aria-label="Language"
            >
              <option>EN</option>
              <option>HI</option>
              <option>FR</option>
              <option>JP</option>
            </select>
            <ChevronDown className="-ml-3 h-3 w-3" />
          </div>
          <div className="flex items-center gap-1.5">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="cursor-pointer appearance-none bg-transparent pr-3 uppercase tracking-[0.28em] outline-none"
              aria-label="Country"
            >
              <option>IN ₹</option>
              <option>US $</option>
              <option>UK £</option>
              <option>EU €</option>
              <option>JP ¥</option>
            </select>
            <ChevronDown className="-ml-3 h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
