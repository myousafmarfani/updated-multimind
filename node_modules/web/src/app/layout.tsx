import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MultiMind | Four AI Models, One Prompt",
    template: "%s | MultiMind",
  },
  description:
    "MultiMind runs one prompt across Gemini, ChatGPT, Claude, and Grok in parallel with model health checks and independent context.",
  keywords: [
    "AI comparison",
    "parallel model responses",
    "Gemini ChatGPT Claude Grok",
    "prompt improvement",
    "multi model chat",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MultiMind",
    description: "One prompt, four model perspectives.",
    url: "/",
    siteName: "MultiMind",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "MultiMind Open Graph",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MultiMind",
    description: "Compare four model responses in one glassy workspace.",
    images: ["/opengraph-image"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MultiMind",
  url: siteUrl,
  logo: `${siteUrl}/opengraph-image`,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MultiMind",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/chat`,
    "query-input": "required name=prompt",
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
      suppressHydrationWarning
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-(--bg-base) text-(--text-primary)">
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
