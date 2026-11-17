import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { COMPANY } from "@/lib/constants";
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
  title: COMPANY.shortName,
  icons: {
    icon: [{ url: "/brand/logo-mark.png", type: "image/png", sizes: "256x256" }],
    apple: [{ url: "/brand/logo-mark.png", sizes: "256x256" }],
  },
  description:
    "Sri Shivam Infotech Solutions, Hyderabad: IT and non-IT staffing, recruitment, payroll, and Android and iOS app development.",
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
        {children}
        <CursorGlow />
      </body>
    </html>
  );
}
