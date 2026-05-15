import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: 600,
  height: 600,
  initialScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "HUD — Sebastian Boscan",
  description: "Meta Ray-Ban Display companion app for sebastianboscan.com",
};

export default function DisplayAppLayout({ children }: { readonly children: React.ReactNode }) {
  return children;
}
