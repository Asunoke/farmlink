import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "FarmLink - Gestion Agricole Intelligente",
  description: "Plateforme SaaS de gestion agricole pour le Mali - Gérez votre ferme en toute simplicité",
  generator: "FarmLink",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <Suspense fallback={null}>{children}</Suspense>
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
