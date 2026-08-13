import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";

const META_PIXEL_ID = "4563845340565065";

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
