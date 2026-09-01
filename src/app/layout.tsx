import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MediBase — Secure Healthcare Record-Sharing Platform",
  description:
    "A secure healthcare record-sharing platform that enables authorized healthcare providers to access and contribute to a patient's longitudinal medical history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
