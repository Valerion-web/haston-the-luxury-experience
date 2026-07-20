import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/collections", changefreq: "weekly", priority: "0.9" },
          { path: "/collections/new-arrivals", changefreq: "weekly", priority: "0.9" },
          { path: "/collections/bestsellers", changefreq: "weekly", priority: "0.8" },
          { path: "/collections/knitwear", changefreq: "weekly", priority: "0.8" },
          { path: "/collections/shirts", changefreq: "weekly", priority: "0.8" },
          { path: "/collections/trousers", changefreq: "weekly", priority: "0.8" },
          { path: "/collections/outerwear", changefreq: "weekly", priority: "0.8" },
          { path: "/lookbook", changefreq: "monthly", priority: "0.7" },
          { path: "/journal", changefreq: "weekly", priority: "0.7" },
          { path: "/about", changefreq: "monthly", priority: "0.6" },
          { path: "/store-locator", changefreq: "monthly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
          { path: "/support", changefreq: "monthly", priority: "0.5" },
          { path: "/login", changefreq: "monthly", priority: "0.3" },
          { path: "/register", changefreq: "monthly", priority: "0.3" },
          { path: "/privacy-policy", changefreq: "monthly", priority: "0.2" },
          { path: "/terms", changefreq: "monthly", priority: "0.2" },
          { path: "/refund-policy", changefreq: "monthly", priority: "0.2" },
        ];

        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
          )
          .join("\n");

        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
