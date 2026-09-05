import { SHIPPING_FLAT, currentPrice, money } from "./catalog";
import { dispatchShort, leadTimeLabel, transitLabel } from "./fulfilment";
import { GUARANTEE_EXCEPTION, GUARANTEE_MEDIUM } from "./guarantee";

/** Named once so the shipping rule reads the same wherever it appears. */
export const PACK_LABEL = "Chillcore pack";

export type Faq = { q: string; a: string };

/**
 * The product page's questions. Nothing here says anything the blurb, specs
 * or objections section does not; the FAQPage JSON-LD is generated from
 * this same array, so the structured data can never drift from what a
 * visitor reads. A function of the shipping promo rather than a constant so
 * the shipping answer stays accurate on the day the promo expires.
 */
export function productFaqs(promoToday: boolean): Faq[] {
  return [
    {
      q: "What is inside The Ice Tin?",
      a: "Three floors in the footprint of a standard can: an empty top floor for spent pouches, a middle floor that holds 25 fresh pouches, and a slim Chillcore ice pack in the base.",
    },
    {
      q: "How long does it keep pouches cold?",
      a: "Six hours at room temperature with the lid sealed on its two O-rings.",
    },
    {
      q: "Does the ice pack come with it?",
      a: "Yes. One Chillcore pack ships inside every tin. Three-packs are sold separately for customers who want a frozen spare available at all times.",
    },
    {
      q: "What is the tin made from?",
      a: "Cerakote-finished 6061-T6 aluminium, bead-blasted matte black, 68 mm across and 41 mm tall.",
    },
    {
      q: "Where does it ship from, and how fast?",
      a: promoToday
        ? `Everything leaves Vancouver, BC. ${dispatchShort()} Shipping is free today on every order.`
        : `Everything leaves Vancouver, BC. ${dispatchShort()} Shipping is ${money(SHIPPING_FLAT)} flat, and free on any order holding both a tin and a ${PACK_LABEL}.`,
    },
    {
      q: "Is there nicotine or tobacco inside?",
      a: "No. Ice Tins Supply Co. sells empty machined cans and ice packs only, and does not sell, ship or supply nicotine or tobacco in any form.",
    },
    {
      q: "What does the warranty cover?",
      a: "A lifetime warranty on the shell against cracking or a failed thread.",
    },
    {
      // the skeptic's question, answered head-on rather than avoided
      q: "Do pouches really go stale otherwise?",
      a: "Yes, in the way a beer goes stale warm: still usable, no longer the thing you paid for. Warmth dries a pouch out and flattens its flavour as the moisture is lost. Held at fridge temperature, a pouch taken at hour six is materially the same as one taken at hour one. Our test conditions are a frozen pack, a closed lid and a 22°C room, which holds for six hours; the same can with an empty tray holds approximately one.",
    },
    {
      q: "When will it actually arrive?",
      a: `Count ${leadTimeLabel()} for your tin to be made and dispatched, then ${transitLabel()} for the courier. A tracking number is emailed the morning it leaves the workshop. The wait is stated here, on the shop page and at checkout rather than after the payment.`,
    },
    {
      q: "What if it is not for me?",
      a: `${GUARANTEE_MEDIUM} There is no requirement that it be unused or in its original packaging. ${GUARANTEE_EXCEPTION}`,
    },
    {
      q: "Can I replace the O-rings or the ice pack?",
      a: "Yes. Chillcore packs are sold in three-packs and seat directly into the base. The two silicone O-rings are standard sizes and fit by hand; contact shop@icetins.com and replacements will be sent at no charge for as long as you own the tin.",
    },
    {
      // the price is the objection at this end of the market
      q: `Why is it ${money(currentPrice("ice-tin"))}?`,
      a: "The tin is machined from solid 6061-T6 in small batches rather than pressed from sheet, the threads and O-rings are specified to keep sealing for six hours after a year of daily use, and the shell is covered for life. The price reflects a working cold system rather than a lid on a container.",
    },
  ];
}

/**
 * The four questions that stop a first-time buyer, for the home page.
 * Written afresh rather than copied from the product page, which owns the
 * full list, so the two URLs never carry the same answer.
 */
export function homeFaqs(): Faq[] {
  return [
    {
      q: "Does it really stay cold all day?",
      a: "Six hours at fridge temperature in a 22°C room with a frozen pack and the lid closed, which is a full shift. The same tin with the tray empty holds for about an hour, so the cold is the pack, not the metal.",
    },
    {
      q: "How long until it arrives?",
      a: `Each tin is machined to order. ${dispatchShort()} A tracking number is emailed the morning it leaves.`,
    },
    {
      q: "What if it is not for me?",
      a: GUARANTEE_MEDIUM,
    },
    {
      q: "Is there anything in it?",
      a: "No. Ice Tins Supply Co. sells empty machined cans and ice packs only, and does not sell, ship or supply nicotine or tobacco in any form.",
    },
  ];
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
