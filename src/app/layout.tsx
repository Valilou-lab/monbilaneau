import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AcquisitionCapture } from "@/components/AcquisitionCapture";
import { SITE } from "@/config/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} — Trouvez la solution adaptée à votre eau`,
  description:
    "Calcaire, goût, eau de boisson : répondez à quelques questions et recevez un devis de professionnels du traitement de l’eau de votre secteur.",
  // Demo: keep out of search engines until go-live.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Trouvez la solution adaptée à votre eau`,
    description: "Calcaire, goût, eau de boisson : recevez un devis de professionnels du traitement de l’eau de votre secteur.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0369a1",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full max-w-[100vw] flex-col overflow-x-hidden font-sans">
        <AcquisitionCapture />
        {children}
      </body>
    </html>
  );
}
