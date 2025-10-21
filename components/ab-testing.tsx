"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Star, TrendingUp } from "lucide-react"

// Type declarations for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

// A/B Test variants for hero section
export const heroVariants = {
  A: {
    title: "Augmentez vos rendements de 40%",
    subtitle: "avec FarmLink",
    description: "La plateforme intelligente qui transforme votre agriculture au Mali. Gérez vos fermes, optimisez vos coûts et maximisez vos profits avec des outils adaptés à votre contexte local.",
    cta: "Essai gratuit",
    ctaSecondary: "Voir la démo"
  },
  B: {
    title: "Transformez votre agriculture au Mali",
    subtitle: "Rendements +40%, Coûts -30%",
    description: "Rejoignez 500+ agriculteurs maliens qui ont déjà révolutionné leur exploitation. Gestion intelligente des parcelles, prévisions météo et marketplace intégré.",
    cta: "Commencer maintenant",
    ctaSecondary: "Découvrir les fonctionnalités"
  },
  C: {
    title: "L'agriculture intelligente",
    subtitle: "fait pour le Mali",
    description: "La seule plateforme qui comprend les défis de l'agriculture malienne. Planifiez vos récoltes, gérez vos équipes et vendez vos produits au meilleur prix.",
    cta: "Essai gratuit 30 jours",
    ctaSecondary: "Voir les témoignages"
  }
}

// A/B Test variants for pricing section
export const pricingVariants = {
  A: {
    title: "Tarifs transparents",
    subtitle: "Choisissez le plan qui correspond à la taille de votre exploitation.",
    highlight: "Populaire"
  },
  B: {
    title: "Investissement rentable",
    subtitle: "Chaque franc investi dans FarmLink vous rapporte 3x plus.",
    highlight: "Recommandé"
  },
  C: {
    title: "Plans adaptés à votre ferme",
    subtitle: "De la petite exploitation familiale aux grandes fermes commerciales.",
    highlight: "Meilleur choix"
  }
}

// A/B Test component
export function ABTestComponent({ 
  testName, 
  variants, 
  defaultVariant = 'A',
  onVariantChange 
}: {
  testName: string
  variants: Record<string, any>
  defaultVariant?: string
  onVariantChange?: (variant: string) => void
}) {
  const [variant, setVariant] = useState(defaultVariant)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load variant from localStorage or assign randomly
    const storedVariant = localStorage.getItem(`ab-test-${testName}`)
    if (storedVariant && variants[storedVariant]) {
      setVariant(storedVariant)
    } else {
      // Random assignment
      const variantKeys = Object.keys(variants)
      const randomVariant = variantKeys[Math.floor(Math.random() * variantKeys.length)]
      setVariant(randomVariant)
      localStorage.setItem(`ab-test-${testName}`, randomVariant)
    }
    setIsLoaded(true)
    onVariantChange?.(variant)
  }, [testName, variants, onVariantChange])

  if (!isLoaded) {
    return <div>Chargement...</div>
  }

  return variants[variant]
}

// Conversion tracking
export function ConversionTracker({ 
  eventName, 
  eventData 
}: {
  eventName: string
  eventData?: Record<string, any>
}) {
  useEffect(() => {
    // Track conversion event
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag('event', eventName, {
          event_category: 'conversion',
          event_label: eventName,
          value: eventData?.value || 0,
          ...eventData
        })
      }

      // Custom analytics
      const analyticsData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        data: eventData,
        userAgent: navigator.userAgent,
        url: window.location.href
      }

      // Send to your analytics endpoint
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyticsData)
      }).catch(console.error)
    }
  }, [eventName, eventData])

  return null
}

// CTA optimization component
export function OptimizedCTA({ 
  variant = 'A',
  onConversion 
}: {
  variant?: 'A' | 'B' | 'C'
  onConversion?: () => void
}) {
  const ctaVariants = {
    A: {
      text: "Essai gratuit",
      style: "bg-[#006633] hover:bg-[#C1440E] text-white",
      icon: ArrowRight,
      size: "lg" as const
    },
    B: {
      text: "Commencer maintenant",
      style: "bg-gradient-to-r from-[#D4AF37] to-[#C1440E] hover:from-[#C1440E] hover:to-[#D4AF37] text-white",
      icon: TrendingUp,
      size: "lg" as const
    },
    C: {
      text: "Essai gratuit 30 jours",
      style: "bg-[#006633] hover:bg-[#C1440E] text-white shadow-lg hover:shadow-xl",
      icon: CheckCircle,
      size: "lg" as const
    }
  }

  const cta = ctaVariants[variant]
  const Icon = cta.icon

  const handleClick = () => {
    onConversion?.()
    // Track CTA click
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'cta_click', {
        event_category: 'engagement',
        event_label: `cta_${variant}`,
        value: 1
      })
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        size={cta.size}
        className={cta.style}
        onClick={handleClick}
      >
        {cta.text}
        <Icon className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  )
}

// Social proof optimization
export function OptimizedSocialProof({ 
  variant = 'A' 
}: {
  variant?: 'A' | 'B' | 'C'
}) {
  const socialProofVariants = {
    A: {
      title: "Rejoignez plus de 500 agriculteurs maliens",
      subtitle: "Qui ont déjà transformé leur agriculture avec FarmLink",
      stats: [
        { number: "500+", label: "Fermes connectées" },
        { number: "40%", label: "Augmentation des rendements" },
        { number: "30%", label: "Réduction des coûts" },
        { number: "24/7", label: "Support technique" }
      ]
    },
    B: {
      title: "Des résultats concrets",
      subtitle: "Prouvés par nos utilisateurs au Mali",
      stats: [
        { number: "500+", label: "Agriculteurs satisfaits" },
        { number: "40%", label: "Gain de rendement moyen" },
        { number: "30%", label: "Économies réalisées" },
        { number: "4.9/5", label: "Note moyenne" }
      ]
    },
    C: {
      title: "La communauté qui grandit",
      subtitle: "Rejoignez les agriculteurs qui réussissent",
      stats: [
        { number: "500+", label: "Membres actifs" },
        { number: "40%", label: "Plus de rendement" },
        { number: "30%", label: "Moins de coûts" },
        { number: "100%", label: "Satisfaction client" }
      ]
    }
  }

  const socialProof = socialProofVariants[variant]

  return (
    <section className="py-16 bg-[#F5F5DC] border-y border-[#D4AF37]/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#0D1B2A] mb-4">
            {socialProof.title}
          </h2>
          <p className="text-lg text-[#0D1B2A]/80">
            {socialProof.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {socialProof.stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group hover:shadow-lg p-4 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-[#006633] mb-2 group-hover:text-[#C1440E] transition-colors">
                {stat.number}
              </div>
              <div className="text-[#0D1B2A] font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
