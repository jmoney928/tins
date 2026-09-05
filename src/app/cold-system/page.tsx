import type { Metadata } from "next";
import { ColdSystem } from "@/components/cold-system";
import { Facts } from "@/components/facts";
import { TopicPage } from "@/components/topic-page";
import { pageMetadata } from "@/lib/seo";

const TITLE = "How a snus tin keeps pouches cold for six hours";
const DESCRIPTION =
  "How the Ice Tin holds 25 pouches at fridge temperature for six hours: a perforated tray over a slim frozen pack, two O-ring seals, and the testing behind it.";
const IMAGE = "/three-floors.jpg";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/cold-system",
  type: "article",
  image: {
    url: IMAGE,
    width: 1400,
    height: 1400,
    alt: "The Ice Tin opened to show its three floors and the ice pack tray",
  },
});

// prices in the closing CTA are read live
export const dynamic = "force-dynamic";

/**
 * The cold mechanism and the testing behind it, on one page.
 *
 * These were two separate homepage anchors, but they answer the same
 * question — does it actually stay cold, and how do you know — so splitting
 * them into two URLs would have them competing for the same search.
 */
export default function ColdSystemPage() {
  return (
    <TopicPage title={TITLE} path="/cold-system" description={DESCRIPTION} image={IMAGE}>
      <ColdSystem heading="h1" />
      <Facts />
    </TopicPage>
  );
}
