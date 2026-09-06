import Image from "next/image";
import { Reveal } from "./reveal";

/**
 * The whole product in four short sentences, next to a photograph of it
 * open. Everything below this section is detail; this is the part a
 * reader has to get.
 */
export function WhatItIs() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal className="overflow-hidden rounded-[2rem] bg-white">
          <Image
            src="/three-layer-gallery.jpg"
            alt="The Ice Tin taken apart: the lid, the pouch floor, and the ice pack tray"
            width={1400}
            height={1400}
            sizes="(max-width: 1024px) 92vw, 46vw"
            className="aspect-square w-full object-cover"
          />
        </Reveal>

        <Reveal delay={100}>
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            What it is
          </p>
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-balance text-white-ice sm:text-5xl">
            A snus tin with an ice pack inside.
          </h2>
          <div className="mt-6 flex flex-col gap-3 text-lg leading-snug text-frost sm:text-xl">
            <p>Your snus goes in the tin.</p>
            <p>A frozen ice pack goes underneath it.</p>
            <p>Close the lid.</p>
            <p className="font-medium text-white-ice">
              Your snus stays cold for six hours.
            </p>
          </div>
          <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-fog">
            That is the whole idea. The tin is solid aluminium and the ice
            pack is a slim disc that sits flat in the base. It is the same
            width as a normal can, one floor taller.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
