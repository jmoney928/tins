import type { Metadata } from "next";
import { Anatomy } from "@/components/anatomy";
import { TopicPage } from "@/components/topic-page";

export const metadata: Metadata = {
  title: "How the tin is built",
  description:
    "Cerakote over 6061-T6 aluminium, bead-blasted matte black, 68 mm across and 41 mm tall. Three floors at 8, 20 and 13 mm, sealed to IPX6 on two silicone O-rings.",
  alternates: { canonical: "/build" },
  openGraph: {
    title: "How the Ice Tin is built",
    description:
      "Machined 6061-T6 aluminium, Cerakote matte black, sealed on two O-rings. Every floor does a job.",
    url: "/build",
    type: "article",
  },
};

export const dynamic = "force-dynamic";

export default function BuildPage() {
  return (
    <TopicPage>
      <Anatomy />
    </TopicPage>
  );
}
