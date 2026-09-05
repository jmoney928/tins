import type { Metadata } from "next";
import { Anatomy } from "@/components/anatomy";
import { TopicPage } from "@/components/topic-page";
import { pageMetadata } from "@/lib/seo";

const TITLE = "How the Ice Tin is built: 6061-T6, sealed to IPX6";
const DESCRIPTION =
  "Cerakote over bead-blasted 6061-T6 aluminium, 68 mm across and 41 mm tall, three floors at 8, 20 and 13 mm, sealed to IPX6 on two silicone O-rings.";
const IMAGE = "/xray-section.png";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/build",
  type: "article",
  image: {
    url: IMAGE,
    width: 1500,
    height: 1055,
    alt: "Cross-section drawing of the Ice Tin showing the three floors and the ice tray",
  },
});

export const dynamic = "force-dynamic";

export default function BuildPage() {
  return (
    <TopicPage title={TITLE} path="/build" description={DESCRIPTION} image={IMAGE}>
      <Anatomy heading="h1" />
    </TopicPage>
  );
}
