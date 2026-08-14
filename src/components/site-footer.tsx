import { BrandMark } from "./brand-mark";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "The Ice Tin", href: "/products/ice-tin" },
      { label: "Chillcore three-pack", href: "/#collection" },
      { label: "Gift card", href: "#" },
      { label: "Stock alerts", href: "/#drop" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & returns", href: "#" },
      { label: "Warranty claim", href: "#" },
      { label: "Ice pack care", href: "#" },
      { label: "Track order", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "The workshop", href: "#" },
      { label: "Stockists", href: "#" },
      { label: "Press kit", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-frost/8 bg-abyss/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <BrandMark size={52} tagline />
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-fog">
              A three-floor snus can with a slim ice pack in the base. Made in
              Vancouver, BC, shipped worldwide.
            </p>
            <p className="mt-6 font-mono text-[11px] leading-relaxed text-fog/60">
              418 Alexander Street, Vancouver, BC V6A 1C4
              <br />
              +1 (604) 555-0148
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title}>
              <h3 className="font-mono text-[11px] tracking-[0.2em] text-fog uppercase">
                {col.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-frost/80 transition-colors duration-300 hover:text-ice-300"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-frost/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[62ch] text-xs leading-relaxed text-fog/70">
            Ice Tins Supply Co. sells empty metal cans and ice packs. We do not sell,
            ship, or supply nicotine or tobacco in any form.
          </p>
          <p className="font-mono text-[11px] tracking-widest text-fog/50 uppercase">
            © {new Date().getFullYear()} Ice Tins Supply Co.
          </p>
        </div>
      </div>
    </footer>
  );
}
