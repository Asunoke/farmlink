import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import { ThemeProvider } from "@/components/theme-provider"
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const Analytics = dynamic(() => import("@vercel/analytics/next").then(mod => ({ default: mod.Analytics })), { ssr: false })

import dynamic from "next/dynamic"
import localFont from "next/font/local"

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
})

const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: "FarmLink - Augmentez vos rendements de 40% | Gestion Agricole Mali",
    template: "%s | FarmLink"
  },
  description: "Plateforme SaaS de gestion agricole pour le Mali - Augmentez vos rendements de 40%, réduisez vos coûts de 30%. Gérez vos fermes, parcelles, budget et équipe. Essai gratuit 30 jours.",
  keywords: [
    "gestion agricole Mali",
    "logiciel ferme Mali",
    "agriculture Mali",
    "rendement agricole",
    "gestion parcelles Mali",
    "budget agricole Mali",
    "SaaS agricole Mali",
    "agriculture digitale Mali",
    "ferme Mali",
    "agriculture intelligente",
    "météo agricole Mali",
    "marketplace agricole Mali"
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
    title: 'FarmLink - Augmentez vos rendements de 40% | Gestion Agricole Mali',
    description: 'Plateforme SaaS de gestion agricole pour le Mali - Augmentez vos rendements de 40%, réduisez vos coûts de 30%. Essai gratuit 30 jours.',
    siteName: 'FarmLink',
    images: [
      {
        url: '/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'FarmLink - Augmentez vos rendements agricoles de 40% au Mali',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FarmLink - Augmentez vos rendements de 40% | Gestion Agricole Mali',
    description: 'Plateforme SaaS de gestion agricole pour le Mali - Augmentez vos rendements de 40%, réduisez vos coûts de 30%.',
    images: ['/hero-bg.jpg'],
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.openweathermap.org" />
      </head>
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <OnboardingProvider>
              <Suspense fallback={null}>{children}</Suspense>
            </OnboardingProvider>
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
