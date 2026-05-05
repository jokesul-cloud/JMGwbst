import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Golf Splooch Lessons | Premium Golf Coaching",
    template: "%s | Golf Splooch Lessons"
  },
  description: "Elevate your game with premium video lessons, personalized drills, and expert coaching for all skill levels.",
  keywords: ["golf coaching", "golf lessons", "swing mechanics", "short game", "putting", "driver power"],
  authors: [{ name: "Chris 'Splooch' Miller" }],
  creator: "Golf Splooch Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://golf-splooch.vercel.app",
    siteName: "Golf Splooch Lessons",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Golf Splooch Lessons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Golf Splooch Lessons | Premium Golf Coaching",
    description: "Elevate your game with premium video lessons and personalized coaching.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black text-white`}
      >
        <main>{children}</main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
