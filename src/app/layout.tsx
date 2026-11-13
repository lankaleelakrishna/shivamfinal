import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { COMPANY } from "@/lib/constants";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-bricolage",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: COMPANY.shortName,
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
    <html lang="en-IN" className={`${bricolage.variable} ${manrope.variable}`}>
      <body>
        {children}
        <CursorGlow />
      </body>
    </html>
  );
}
