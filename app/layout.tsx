import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FluxBot Terminal — Statistical Arbitrage",
  description:
    "Live cross-exchange statistical arbitrage terminal. Real-time opportunities, executions, PnL, and signal log for the FluxBot trading engine.",
  manifest: "/manifest.json",
  applicationName: "FluxBot Terminal",
  appleWebApp: { capable: true, title: "FluxBot", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#070d0a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mono.variable} ${sans.variable} bg-background`}>
      <body className="font-mono antialiased">{children}</body>
    </html>
  );
}
