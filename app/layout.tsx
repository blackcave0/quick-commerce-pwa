import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"
import FirebaseDebug from "@/components/firebase-debug"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "buzzNT - Quick Commerce Delivery",
  description: "Get groceries and essentials delivered in minutes",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "buzzNT",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            {children}
            <FirebaseDebug />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
