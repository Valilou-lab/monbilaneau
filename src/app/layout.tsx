import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AcquisitionCapture } from "@/components/AcquisitionCapture";
import { SITE } from "@/config/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: `${SITE.name} — Trouvez la solution adaptée à votre eau`,
  description:
    "Calcaire, goût, eau de boisson : répondez à quelques questions et recevez un devis de professionnels du traitement de l’eau de votre secteur.",
  // Demo: keep out of search engines until go-live.
  robots: { index: false, follow: false },
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
