import type { Metadata } from "next";
import { Guarantee } from "@/components/guarantee";
import { TopicPage } from "@/components/topic-page";
import { pageMetadata } from "@/lib/seo";
import { GUARANTEE_DAYS } from "@/lib/guarantee";

const TITLE = `The ${GUARANTEE_DAYS}-day cold-or-refund guarantee`;
const DESCRIPTION = `Use the Ice Tin for ${GUARANTEE_DAYS} days. If it does not hold pouches colder for a full shift, return it used, in any packaging, for a full refund with return shipping paid.`;
const IMAGE = "/side-product.jpg";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guarantee",
  image: { url: IMAGE, width: 1100, height: 1100, alt: "The Ice Tin" },
});

export const dynamic = "force-dynamic";

export default function GuaranteePage() {
  return (
    <TopicPage
      title={TITLE}
      path="/guarantee"
      description={DESCRIPTION}
      image={IMAGE}
      article={false}
    >
      <Guarantee heading="h1" />
    </TopicPage>
  );
}
