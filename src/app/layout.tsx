import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://icetins.com"),
  title: {
    default: "Ice Tins Supply Co. — Machined snus tin cases",
    template: "%s — Ice Tins",
  },
  description:
    "A three-floor snus can holding 25 fresh pouches: spent on top, fresh in the middle, a slim ice pack underneath. Machined 6061-T6, stays cold for 6 hours. $59.99 CAD.",
  keywords: [
    "snus can",
    "snus tin case",
    "cooled snus can",
    "three compartment snus can",
    "pouch case",
  ],
  openGraph: {
    title: "Ice Tins Supply Co. — Cold to the last pouch",
    description:
      "25 pouches across three floors, in the footprint of a standard can, with a slim ice pack in the base. Stays cold for 6 hours. $59.99 CAD.",
    url: "https://icetins.com",
    siteName: "Ice Tins Supply Co.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ice Tins Supply Co. — Cold to the last pouch",
    description:
      "A three-floor machined snus can with a slim ice pack in the base. $59.99 CAD.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
