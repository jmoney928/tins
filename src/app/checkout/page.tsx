import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout-client";
import { FrostField } from "@/components/frost-field";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return (
    <>
      <FrostField />
      <CheckoutClient />
    </>
  );
}
