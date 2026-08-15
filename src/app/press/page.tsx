import type { Metadata } from "next";
import Image from "next/image";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Press kit",
  alternates: { canonical: "/press" },
};

const ASSETS = [
  { src: "/logo-emblem-512.png", label: "Emblem, full", size: "512×512" },
  { src: "/logo-compact-512.png", label: "Emblem, compact", size: "512×512" },
  { src: "/side-product.jpg", label: "Product photo", size: "1100×1100" },
];

export default function PressPage() {
  return (
    <InfoPage
      eyebrow="Company"
      title="Press kit"
      intro="Logo files, a product shot, and the boilerplate — for anyone writing about the tin."
    >
      <section>
        <h2 className="text-lg font-medium text-white-ice">Boilerplate</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Ice Tins Supply Co. makes a machined aluminium snus tin with a
          built-in ice pack tray: a three-floor can, standard diameter,
          holding 25 fresh pouches and keeping them at fridge temperature
          for six hours. Machined in small batches in Vancouver, BC. Ice
          Tins sells empty metal cans and ice packs only — never nicotine or
          tobacco in any form.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Assets</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ASSETS.map((a) => (
            <a
              key={a.src}
              href={a.src}
              download
              className="glass-edge group flex flex-col overflow-hidden rounded-2xl bg-paper/75"
            >
              <div className="relative aspect-square bg-ink">
                <Image src={a.src} alt={a.label} fill sizes="200px" className="object-contain p-6" />
              </div>
              <div className="p-4">
                <p className="text-sm text-white-ice">{a.label}</p>
                <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-fog uppercase">
                  {a.size} — download
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Contact</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          For interviews, samples, or anything else:{" "}
          <a href="mailto:hello@icetins.com" className="text-ice-700 underline underline-offset-2">
            hello@icetins.com
          </a>
          . For order and product questions:{" "}
          <a href="mailto:shop@icetins.com" className="text-ice-700 underline underline-offset-2">
            shop@icetins.com
          </a>
          .
        </p>
      </section>
    </InfoPage>
  );
}
