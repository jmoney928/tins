import type { Metadata } from "next";
import { ColdSystem } from "@/components/cold-system";
import { Facts } from "@/components/facts";
import { TopicPage } from "@/components/topic-page";

export const metadata: Metadata = {
  title: "How the cold system works",
  description:
    "Three floors, one of them a freezer: a perforated tray of twenty-five pouches sitting over a slim frozen pack, sealed on two O-rings. Holds fridge temperature for six hours at room ambient.",
  alternates: { canonical: "/cold-system" },
  openGraph: {
    title: "How the Ice Tin keeps pouches cold",
    description:
      "A perforated floor over a slim frozen pack, sealed on two O-rings. Six hours at room temperature.",
    url: "/cold-system",
    type: "article",
  },
};

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
    <TopicPage>
      <ColdSystem />
      <Facts />
    </TopicPage>
  );
}
