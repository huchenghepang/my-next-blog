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
  title: "云间书",
  description: "护城河的天空之城",
  keywords: ["技术", "博客", "文章"],
  icons: "/favicon.ico",
};

const loadColor = `(function () { const t = localStorage.getItem("theme"); const a = document.documentElement.classList; if (t === 'light' || t === 'dark') { document.documentElement.classList.add(t); } })();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning={true}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: loadColor }} />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-amber-100 text-black dark:bg-zinc-600  dark:text-white`}
      >
        {/* 头部横幅 */}
        {children}
      </body>
    </html>
  );
}
