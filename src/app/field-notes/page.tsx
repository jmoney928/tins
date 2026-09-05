import type { Metadata } from "next";
import { Carriers } from "@/components/carriers";
import { TopicPage } from "@/components/topic-page";
import { pageMetadata } from "@/lib/seo";

const TITLE = "Field notes from the Ice Tin testers";
const DESCRIPTION =
  "What five people carrying the Ice Tin through a season of shifts report, from a lift mechanic in Åre to a bar manager in Chicago and a dock hand in Reykjavík.";
const IMAGE = "/in-hand.jpg";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/field-notes",
  type: "article",
  image: {
    url: IMAGE,
    width: 1045,
    height: 1400,
    alt: "The Ice Tin held in a hand",
  },
});

export const dynamic = "force-dynamic";

export default function FieldNotesPage() {
  return (
    <TopicPage title={TITLE} path="/field-notes" description={DESCRIPTION} image={IMAGE}>
      <Carriers heading="h1" />
    </TopicPage>
  );
}
