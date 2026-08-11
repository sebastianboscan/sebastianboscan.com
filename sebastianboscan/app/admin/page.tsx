import { notFound } from "next/navigation";
import { AdminPanel } from "./AdminPanel";

// Authoring tool only — never part of the deployed site.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Sebastian Boscan",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <AdminPanel />;
}
