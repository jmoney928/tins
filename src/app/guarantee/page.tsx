import type { Metadata } from "next";
import { Guarantee } from "@/components/guarantee";
import { TopicPage } from "@/components/topic-page";
import { GUARANTEE_DAYS } from "@/lib/guarantee";

export const metadata: Metadata = {
  title: "The cold-or-refund guarantee",
  description: `Carry the Ice Tin for ${GUARANTEE_DAYS} days. If it does not keep your pouches colder and your pockets cleaner, send it back for a full refund and we cover return shipping. No unused-in-original-packaging fine print.`,
  alternates: { canonical: "/guarantee" },
  openGraph: {
    title: "The cold-or-refund guarantee",
    description: `${GUARANTEE_DAYS} days to actually use it. Full refund, return shipping on us.`,
    url: "/guarantee",
    type: "article",
  },
};

export const dynamic = "force-dynamic";

export default function GuaranteePage() {
  return (
    <TopicPage>
      <Guarantee />
    </TopicPage>
  );
}
