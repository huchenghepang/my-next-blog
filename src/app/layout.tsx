import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
  title: "云间书",
  description: "护城河的天空之城",
  keywords: ["技术", "博客", "文章"],
  icons: "/favicon.ico",
};

const loadColor = `(function () { const t = localStorage.getItem("theme");if (t === 'light' || t === 'dark') { document.documentElement.classList.add(t); } })();`;

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
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-amber-100 text-black dark:bg-zinc-600  dark:text-white`}
        suppressContentEditableWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
