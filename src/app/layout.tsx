import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Simple Sleep Tracker: Journal",
  description: "Track sleep debt, bedtime consistency, and notes. Simple sleep journal with Apple Health-style insights.",
  keywords: ["sleep tracker", "sleep journal", "sleep debt", "bedtime consistency", "sleep log"],
  openGraph: {
    title: "Simple Sleep Tracker: Journal",
    description: "Sleep debt, bedtime consistency, notes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
