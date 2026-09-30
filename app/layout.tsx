import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dm = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm",
});

export const metadata: Metadata = {
  title: "neuro.ad — know how the campaign lands",
  description:
    "Test a campaign with NMFM before you spend. Attention, emotion, memory, purchase intent, audience match, trend alignment, and an overall neuromarketing score.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dm.variable} h-full`}>
      <body className="min-h-full bg-void font-sans text-cream antialiased">{children}</body>
    </html>
  );
}
