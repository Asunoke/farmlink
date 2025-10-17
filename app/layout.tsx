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
  title: {
    default: "FarmLink - Gestion Agricole Intelligente",
    template: "%s | FarmLink"
  },
  description: "Plateforme SaaS de gestion agricole pour le Mali - Gérez votre ferme, parcelles, budget et équipe en toute simplicité. Optimisez vos rendements agricoles.",
  keywords: [
    "gestion agricole",
    "ferme Mali",
    "agriculture",
    "parcelles",
    "budget agricole",
    "rendement",
    "SaaS agricole",
    "gestion ferme",
    "agriculture digitale"
  ],
  authors: [{ name: "FarmLink Team" }],
  creator: "FarmLink",
  publisher: "FarmLink",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://farmlinkmali.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_ML',
    url: '/',
    title: 'FarmLink - Gestion Agricole Intelligente',
    description: 'Plateforme SaaS de gestion agricole pour le Mali - Gérez votre ferme, parcelles, budget et équipe en toute simplicité.',
    siteName: 'FarmLink',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FarmLink - Gestion Agricole Intelligente',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FarmLink - Gestion Agricole Intelligente',
    description: 'Plateforme SaaS de gestion agricole pour le Mali - Gérez votre ferme en toute simplicité.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
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
