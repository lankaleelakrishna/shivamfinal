import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FormTabProvider } from "@/components/providers/FormTabProvider";
import { COMPANY } from "@/lib/constants";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: COMPANY.shortName,
  icons: {
    icon: [{ url: "/brand/logo-mark.png", type: "image/png", sizes: "256x256" }],
    apple: [{ url: "/brand/logo-mark.png", sizes: "256x256" }],
  },
  description: SITE_DESCRIPTION,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#101f31" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body>
        <FormTabProvider>
          <Header />
          <main id="top">{children}</main>
          <Footer />
        </FormTabProvider>
        <CursorGlow />
      </body>
    </html>
  );
}
