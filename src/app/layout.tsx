import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "MediBase — Secure Healthcare Platform",
  description:
    "A secure healthcare record-sharing platform enabling authorized healthcare providers and patients to manage longitudinal medical history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen antialiased flex flex-col font-sans bg-[#F8FAFC] text-slate-900">
        {children}
      </body>
    </html>
  );
}
