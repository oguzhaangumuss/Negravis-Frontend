import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { WalletProvider } from "@/components/providers/WalletProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Negravis Oracle - Real-time Multi-Source Oracle System",
  description: "Advanced Oracle platform providing real-time cryptocurrency prices, weather data, and custom API integrations with Hedera blockchain support and AI-powered consensus mechanisms.",
  keywords: ["oracle", "hedera", "blockchain", "cryptocurrency", "weather", "api", "real-time", "consensus", "chainlink", "coingecko"],
  authors: [{ name: "Oğuzhan Gümüş" }],
  creator: "Oğuzhan Gümüş",
  publisher: "Negravis",
  applicationName: "Negravis Oracle",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Negravis Oracle",
    title: "Negravis Oracle - Multi-Source Oracle System",
    description: "Advanced Oracle platform with real-time data aggregation from multiple sources including Chainlink, CoinGecko, and custom APIs.",
    url: "https://negravis-frontend.vercel.app",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Negravis Oracle System Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@negravis",
    creator: "@oguzhangumus",
    title: "Negravis Oracle - Real-time Multi-Source Oracle System",
    description: "Advanced Oracle platform providing real-time data with AI-powered consensus mechanisms.",
    images: ["/twitter-image.jpg"],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <WalletProvider>
          <Navbar />
          <div className="relative flex-1">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
            <main className="relative z-10">
              {children}
            </main>
          </div>
          <Footer />
        </WalletProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Theme detection
              try {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', prefersDark);
              } catch (e) {}
            `,
          }}
        />
      </body>
    </html>
  );
}
