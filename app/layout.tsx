import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import { ThemeProvider } from "@/components/theme-provider"
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

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
        url: '/og-image.jpg',
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
