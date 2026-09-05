import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Attribution } from "@/components/attribution";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteMotion } from "@/components/motion-config";
import { JsonLd } from "@/components/json-ld";
import {
  CONTACT_EMAIL,
  OG_DEFAULT,
  ORG_ID,
  ORG_NAME,
  SITE_URL,
  WEBSITE_ID,
  absoluteUrl,
} from "@/lib/seo";

const META_PIXEL_ID = "4563845340565065";

/**
 * Site-wide identity graph. Every page inherits this via the root layout,
 * so an answer engine or a rich-results crawler can resolve "who sells
 * this" without depending on any one page having its own copy.
 */
const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: ORG_NAME,
  alternateName: "Ice Tins",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo-emblem-512.png`,
    width: 512,
    height: 512,
  },
  image: absoluteUrl(OG_DEFAULT.url),
  description:
    "Maker of The Ice Tin, a machined aluminium snus tin with a built-in ice pack tray that holds 25 pouches at fridge temperature for six hours. Made in Vancouver, BC; ships worldwide.",
  email: CONTACT_EMAIL,
  contactPoint: {
    "@type": "ContactPoint",
    email: CONTACT_EMAIL,
    contactType: "customer service",
    availableLanguage: "en",
  },
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    streetAddress: "8105 North Fraser Way",
    addressLocality: "Burnaby",
    addressRegion: "BC",
    postalCode: "V5J 5M8",
    addressCountry: "CA",
  },
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: ORG_NAME,
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
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
    default: "Ice Tins Supply Co. — Cooled snus tin with a built-in ice pack",
    template: "%s — Ice Tins",
  },
  description:
    "The Ice Tin is a machined aluminium snus tin with a slim ice pack in the base. Holds 25 pouches at fridge temperature for six hours. Made in Vancouver, BC.",
  keywords: [
    "snus tin",
    "snus can",
    "cooled snus tin",
    "snus tin with ice pack",
    "metal snus can",
    "nicotine pouch case",
    "pouch tin",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ice Tins Supply Co. — Cooled snus tin with a built-in ice pack",
    description:
      "A machined aluminium snus tin with a slim ice pack in the base. 25 pouches at fridge temperature for six hours.",
    url: SITE_URL,
    siteName: ORG_NAME,
    locale: "en_CA",
    type: "website",
    images: [{ ...OG_DEFAULT, url: absoluteUrl(OG_DEFAULT.url) }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ice Tins Supply Co. — Cooled snus tin with a built-in ice pack",
    description:
      "A machined aluminium snus tin with a slim ice pack in the base. 25 pouches at fridge temperature for six hours.",
    images: [absoluteUrl(OG_DEFAULT.url)],
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
        <JsonLd id="org-json-ld" data={ORG_JSON_LD} />
        <JsonLd id="website-json-ld" data={WEBSITE_JSON_LD} />
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

        {/* sections below the fold reveal on scroll; with scripts off, they
            are simply there — see components/reveal.tsx */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <Attribution />

        <SiteMotion>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </SiteMotion>
      </body>
    </html>
  );
}
