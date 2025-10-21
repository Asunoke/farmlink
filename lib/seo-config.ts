export const seoConfig = {
  // Meta titles optimized for Mali agriculture
  titles: {
    home: "FarmLink - Augmentez vos rendements de 40% | Gestion Agricole Mali",
    features: "Fonctionnalités FarmLink - Gestion Ferme Mali | Planification Récoltes",
    pricing: "Tarifs FarmLink - Logiciel Agricole Mali | Essai Gratuit 30 Jours",
    about: "À Propos FarmLink - Plateforme Agricole Mali | Notre Mission",
    contact: "Contact FarmLink - Support Agricole Mali | Aide 24/7"
  },

  // Meta descriptions with local keywords
  descriptions: {
    home: "Plateforme SaaS de gestion agricole pour le Mali - Augmentez vos rendements de 40%, réduisez vos coûts de 30%. Gérez vos fermes, parcelles, budget et équipe. Essai gratuit 30 jours.",
    features: "Découvrez toutes les fonctionnalités FarmLink : gestion des parcelles, planification des récoltes, suivi budgétaire, météo en temps réel. Adapté à l'agriculture malienne.",
    pricing: "Tarifs transparents pour votre exploitation agricole au Mali. Plans Starter, Professional et Enterprise. Commencez gratuitement avec FarmLink.",
    about: "FarmLink révolutionne l'agriculture au Mali avec des outils digitaux adaptés au contexte local. Rejoignez 500+ agriculteurs qui nous font confiance.",
    contact: "Besoin d'aide avec FarmLink ? Notre équipe d'experts agricoles vous accompagne 24/7. Support technique, formation et conseils personnalisés."
  },

  // Keywords optimized for Mali market
  keywords: {
    primary: [
      "gestion agricole Mali",
      "logiciel ferme Mali", 
      "agriculture Mali",
      "rendement agricole",
      "gestion parcelles Mali",
      "budget agricole Mali",
      "SaaS agricole Mali",
      "agriculture digitale Mali"
    ],
    secondary: [
      "ferme Mali",
      "agriculture intelligente",
      "météo agricole Mali",
      "marketplace agricole Mali",
      "planification récoltes Mali",
      "gestion équipe agricole",
      "analytics agricole Mali",
      "agriculture durable Mali"
    ],
    longTail: [
      "comment augmenter rendement agricole Mali",
      "logiciel gestion ferme Mali gratuit",
      "plateforme agriculture digitale Mali",
      "outil planification récoltes Mali",
      "gestion budget exploitation agricole Mali"
    ]
  },

  // Structured data for agriculture
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "FarmLink",
      "description": "Plateforme SaaS de gestion agricole pour le Mali",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "15000",
        "priceCurrency": "XOF"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "500"
      }
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Accueil",
          "item": "https://farmlinkmali.vercel.app"
        }
      ]
    }
  },

  // Open Graph images
  ogImages: {
    home: "/og-home.jpg",
    features: "/og-features.jpg", 
    pricing: "/og-pricing.jpg",
    about: "/og-about.jpg"
  },

  // Local business schema for Mali
  localBusiness: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FarmLink",
    "description": "Plateforme de gestion agricole pour le Mali",
    "url": "https://farmlinkmali.vercel.app",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ML",
      "addressLocality": "Bamako"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+223-XX-XX-XX-XX",
      "contactType": "customer service",
      "availableLanguage": ["French", "Bambara"]
    },
    "sameAs": [
      "https://facebook.com/farmlinkmali",
      "https://twitter.com/farmlinkmali",
      "https://linkedin.com/company/farmlinkmali"
    ]
  }
}

// Generate meta tags for a page
export function generateMetaTags(page: keyof typeof seoConfig.titles) {
  return {
    title: seoConfig.titles[page],
    description: seoConfig.descriptions[page],
    keywords: [...seoConfig.keywords.primary, ...seoConfig.keywords.secondary].join(', '),
    openGraph: {
      title: seoConfig.titles[page],
      description: seoConfig.descriptions[page],
      images: [seoConfig.ogImages[page] || seoConfig.ogImages.home]
    }
  }
}

// Generate structured data for a page
export function generateStructuredData(page: string) {
  const baseData = {
    ...seoConfig.structuredData.organization,
    ...seoConfig.localBusiness
  }

  if (page === 'home') {
    return {
      ...baseData,
      ...seoConfig.structuredData.breadcrumb
    }
  }

  return baseData
}
