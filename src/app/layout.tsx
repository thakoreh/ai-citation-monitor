import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thakoreh.github.io/ai-citation-monitor"),
  title: "Citation Monitor — AI Brand Citation Tracking",
  description:
    "Track when ChatGPT, Perplexity, Gemini, and Google AI Overviews recommend your brand or your competitors.",
  openGraph: {
    title: "Citation Monitor — AI Brand Citation Tracking",
    description:
      "Find the buyer prompts where answer engines mention competitors instead of you, then turn missed citations into publish-ready fixes.",
    url: "https://thakoreh.github.io/ai-citation-monitor/",
    siteName: "Citation Monitor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Citation Monitor — AI Brand Citation Tracking",
    description:
      "Know when AI engines recommend your competitors instead of you.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-[#08090a] font-sans">{children}</body>
    </html>
  );
}
