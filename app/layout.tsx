import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { StringTuneInit } from "@/components/string-tune-init";
import "./globals.css";

const dm = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "neuro.ad, know how the campaign lands",
  description:
    "Test a campaign with NMFM before you spend. Attention, emotion, memory, purchase intent, audience match, trend alignment, and an overall neuromarketing score.",
  robots: { index: false, follow: false },
  icons: { icon: "/brand/fox.svg" },
  other: { "theme-color": "#111111" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dm.variable} h-full`}>
      <body className="min-h-full bg-surface font-sans text-ink-2 antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('neuroad-loader')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('loader-skip')}catch(e){}",
          }}
        />
        <StringTuneInit />
        {children}
      </body>
    </html>
  );
}
