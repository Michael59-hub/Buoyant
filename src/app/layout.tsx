import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SessionWrapper from "@/components/SessionWrapper";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buoyant | Digital Product Marketplace Nigeria",
  description: "Buy and sell premium digital products on Buoyant. From software templates to creative assets, discover high-quality digital tools designed for the Nigerian market. Start browsing today",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth()
  return (
    <html lang="en">
      <body
        className={cn("bg-background min-h-screen font-sans antialiased",geistSans.variable || geistMono.variable)}
      >
        <SessionWrapper session={session}>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}

// `${geistSans.variable} ${geistMono.variable} antialiased`