import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShoppDropp — AI Autonomous Store Management",
  description: "Connect your Shopify store and let our AI agent handle catalog management, pricing optimization, inventory sync, and marketing — 24/7 autonomous management for dropshippers and agencies.",
  keywords: "shopify, dropshipping, ai agent, autonomous, catalog management, inventory sync, dropshipper tools",
  openGraph: {
    title: "ShoppDropp — AI Autonomous Store Management",
    description: "Your Shopify store, managed by AI. 24/7 autonomous catalog optimization.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} antialiased dark`}>
      <body className="min-h-full bg-[#0a0a0f] text-white overflow-x-hidden">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
