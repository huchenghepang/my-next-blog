import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/* 谷歌字体使得更容易SEO */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = { 
  title:"天空之城",
  description: "护城河的天空之城",
  keywords:["技术","博客","文章"]
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-amber-100 dark:bg-zinc-800 text-black dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
