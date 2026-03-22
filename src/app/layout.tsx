import {AppRouterCacheProvider} from "@mui/material-nextjs/v16-appRouter"
import CssBaseline from "@mui/material/CssBaseline"
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript"
import {ThemeProvider} from "@mui/material/styles"
import type {Metadata} from "next"
import "./globals.css"
import theme from "./theme"
export const metadata: Metadata = {
  title: "云间书",
  description: "护城河的天空之城",
  keywords: ["技术", "博客", "文章"],
  icons: "/favicon.ico",
}

// const loadColor = `(function () { const t = localStorage.getItem("theme");if (t === 'light' || t === 'dark') { document.documentElement.classList.add(t); } })();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <script dangerouslySetInnerHTML={{__html: loadColor}} /> */}
      </head>

      <body>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{enableCssLayer: true}}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
