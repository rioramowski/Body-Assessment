import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Body Assessment for Executives Over 50",
  description:
    "Answer 16 targeted questions to reveal your true Body Age, your risk tier, and what to fix first.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans text-ink antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
