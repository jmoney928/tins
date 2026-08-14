import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ORG_NAME, SITE_URL } from "@/lib/seo";

const META_PIXEL_ID = "4563845340565065";

/**
 * Site-wide identity graph. Every page inherits this via the root layout,
 * so an answer engine or a rich-results crawler can resolve "who sells
 * this" without depending on any one page having its own copy.
 */
const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: ORG_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-emblem-512.png`,
  description:
    "Machined aluminium snus tin cases with a built-in ice pack tray, made in Vancouver, BC.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "418 Alexander Street",
    addressLocality: "Vancouver",
    addressRegion: "BC",
    postalCode: "V6A 1C4",
    addressCountry: "CA",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ice Tins Supply Co. — Cold to the last pouch",
    description:
      "25 pouches across three floors, in the footprint of a standard can, with a slim ice pack in the base. Stays cold for 6 hours. $59.99 CAD.",
    url: SITE_URL,
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
        {/* plain <script>, not next/script — Script defaults to afterInteractive,
            which injects client-side after hydration and is invisible to any
            crawler that reads the server response rather than executing JS */}
        <script
          id="org-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
