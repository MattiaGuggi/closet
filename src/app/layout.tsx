import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AnimationProvider from "./components/AnimationProvider";
import { UserProvider } from "./context/UserContext";
import React from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClosetApp — 3D Digital Wardrobe & Studio",
  description: "Upload clothes and build perfect outfits in interactive 3D.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 min-h-screen`}
      >
        <main className="w-full min-h-screen flex-1 flex flex-col items-center justify-start bg-zinc-950 relative overflow-x-hidden">
          {/* Ambient Background Glows */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />
          <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[160px] pointer-events-none rounded-full" />

          <UserProvider>
            <AnimationProvider>{children}</AnimationProvider>
          </UserProvider>
        </main>
      </body>
    </html>
  );
}
