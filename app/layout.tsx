import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Pennywise — Expense Tracker",
  description: "Clear, simple expense and budget tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#f6f7f4]">
        <Navbar />
        <main className="min-h-screen px-4 pb-24 pt-7 md:px-8 md:pb-10 md:pt-9 lg:ml-64 lg:px-10 xl:px-14">
          <div className="mx-auto w-full max-w-[1440px]">
          {children}
          </div>
        </main>
      </body>
    </html>
  );
}
