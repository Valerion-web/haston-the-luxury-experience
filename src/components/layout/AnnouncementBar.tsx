const messages = [
  "Complimentary shipping on orders over $180",
  "Autumn Collection — Now available",
  "Complimentary alterations in-store",
  "Private appointments available worldwide",
];

export function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-primary text-primary-foreground">
      <div className="flex animate-marquee whitespace-nowrap py-2.5">
        {[...messages, ...messages, ...messages].map((m, i) => (
          <span key={i} className="mx-10 text-[10.5px] uppercase tracking-[0.32em]">
            {m} <span className="mx-8 opacity-40">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
