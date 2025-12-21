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

// Processes env var. VERCEL_URL when deployed on vercel, localhost:3000 when deployed locally
const url = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

// This is the default metadata for every webpage unless explicitly stated otherwise
export const metadata: Metadata = {
  title: "Sebastian Boscan - Developer",
  description: "Computer Science Student working at the University of South Carolina",
  metadataBase: new URL(url),
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
