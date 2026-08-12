import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout-client";
import { FrostField } from "@/components/frost-field";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      <FrostField />
      <CheckoutClient />
    </>
  );
}
