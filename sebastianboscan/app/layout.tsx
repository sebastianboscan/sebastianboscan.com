import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

// Processes env var. VERCEL_URL when deployed on vercel, localhost:3000 when deployed locally
let baseURL: string
if (process.env.NEXT_PUBLIC_SITE_URL) {
  baseURL = process.env.NEXT_PUBLIC_SITE_URL
} else if (process.env.VERCEL_URL) {
  baseURL = `https://${process.env.VERCEL_URL}`
} else {
  baseURL = "http://localhost:3000"
}

// This is the default metadata for every webpage unless explicitly stated otherwise
export const metadata: Metadata = {
  title: "Sebastian Boscan - Developer",
  description: "Computer Science student building at the intersection of robotics, VR, and real-world engineering.",
  metadataBase: new URL(baseURL),
  openGraph: {
    images: ["/images/headshot.jpg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
