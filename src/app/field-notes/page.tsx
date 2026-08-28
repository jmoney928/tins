import type { Metadata } from "next";
import { Carriers } from "@/components/carriers";
import { TopicPage } from "@/components/topic-page";

export const metadata: Metadata = {
  title: "Field notes from the testers",
  description:
    "What five people carrying the Ice Tin every day actually report — a lift mechanic in Åre, a bar manager in Chicago, a joiner in Gothenburg, a dock hand in Reykjavík and a sound engineer in Oslo.",
  alternates: { canonical: "/field-notes" },
  openGraph: {
    title: "Field notes from the Ice Tin testers",
    description:
      "Named people who carried one through a season of real shifts, and what they reported back.",
    url: "/field-notes",
    type: "article",
  },
};

export const dynamic = "force-dynamic";

export default function FieldNotesPage() {
  return (
    <TopicPage>
      <Carriers />
    </TopicPage>
  );
}
