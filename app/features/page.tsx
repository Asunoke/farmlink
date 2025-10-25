"use client"

import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Cloud, 
  Shield, 
  Smartphone,
  TrendingUp,
  Globe,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Lightbulb,
  Heart
} from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { FeaturesStats } from "@/components/features-stats"

const features = [
  {
    id: "farming",
    title: "Gestion Agricole",
    description: "Optimisez vos fermes et parcelles avec des outils intelligents",
    icon: Target,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    features: [
      "Suivi des parcelles en temps réel",
      "Planification des cultures",
      "Gestion des récoltes",
      "Analyse des rendements"
    ]
  },
  {
    id: "marketplace",
    title: "Marketplace",
    description: "Connectez-vous avec d'autres agriculteurs et acheteurs",
    icon: ShoppingCart,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50",
    features: [
      "Vente de produits agricoles",
      "Achat de semences et équipements",
      "Négociations en temps réel",
      "Système de notation"
    ]
  },
  {
    id: "analytics",
    title: "Analytics & Rapports",
    description: "Prenez des décisions basées sur des données",
    icon: BarChart3,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    features: [
      "Tableaux de bord personnalisés",
      "Rapports de performance",
      "Prédictions de rendement",
      "Analyse des coûts"
    ]
  },
  {
    id: "team",
    title: "Gestion d'Équipe",
    description: "Organisez votre équipe agricole efficacement",
    icon: Users,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    features: [
      "Gestion des employés",
      "Planification des tâches",
      "Suivi des performances",
      "Calcul des salaires"
    ]
  },
  {
    id: "weather",
    title: "Météo Intelligente",
    description: "Anticipez les conditions météorologiques",
    icon: Cloud,
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-50",
    features: [
      "Prévisions météo précises",
      "Alertes météorologiques",
      "Recommandations d'irrigation",
      "Planification saisonnière"
    ]
  },

]

// Stats moved to FeaturesStats component

const testimonials = [
  {
    name: "Amadou Traoré",
    role: "Agriculteur, Mali",
    content: "FarmLink m'a permis d'augmenter mes rendements de 40% grâce à ses outils d'analyse.",
    rating: 5,
    avatar: "AT"
  },
  {
    name: "Fatou Diallo",
    role: "Productrice, Mali",
    content: "Le marketplace m'a ouvert de nouveaux marchés pour mes légumes bio.",
    rating: 5,
    avatar: "FD"
  },
  {
    name: "Ibrahim Keita",
    role: "Fermier, Mali",
    content: "La gestion d'équipe est maintenant un jeu d'enfant avec FarmLink.",
    rating: 5,
    avatar: "IK"
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] via-[#FFF8DC] to-[#F0E68C]">
      <MainNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0D1B2A] mb-6">
              Fonctionnalités
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#C1440E]">
                FarmLink
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[#0D1B2A]/80 max-w-3xl mx-auto">
              Découvrez toutes les fonctionnalités qui font de FarmLink la plateforme 
              de référence pour l'agriculture moderne en Afrique
            </p>
          </div>

          {/* Stats */}
          <FeaturesStats />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-4 md:mb-6">
              Nos Fonctionnalités Principales
            </h2>
            <p className="text-lg md:text-xl text-[#0D1B2A]/80 max-w-3xl mx-auto">
              Une suite complète d'outils pour moderniser votre agriculture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`${feature.bgColor} rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#D4AF37]/20`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${feature.color} rounded-xl mb-4 md:mb-6`}>
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#0D1B2A] mb-3 md:mb-4">
                  {feature.title}
                </h3>
                <p className="text-[#0D1B2A]/70 mb-4 md:mb-6 text-sm md:text-base">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-[#0D1B2A]/80 text-sm md:text-base">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#006633] mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Feature Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-4 md:mb-6">
              Pourquoi Choisir FarmLink ?
            </h2>
            <p className="text-lg md:text-xl text-[#0D1B2A]/80 max-w-3xl mx-auto">
              Des avantages concrets pour votre activité agricole
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Zap,
                title: "Performance",
                description: "Augmentez vos rendements de 40% en moyenne",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "Sécurité",
                description: "Vos données sont protégées et sécurisées",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Globe,
                title: "Connectivité",
                description: "Connectez-vous avec des agriculteurs du monde entier",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description: "Technologies de pointe pour l'agriculture moderne",
                color: "from-purple-500 to-violet-500"
              },
              {
                icon: Heart,
                title: "Communauté",
                description: "Rejoignez une communauté passionnée d'agriculteurs",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: Award,
                title: "Reconnaissance",
                description: "Reconnu par les professionnels du secteur",
                color: "from-amber-500 to-yellow-500"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 md:p-8 rounded-2xl bg-[#F5F5DC]/50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-[#D4AF37]/20"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${item.color} rounded-xl mb-4 md:mb-6`}>
                  <item.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#0D1B2A] mb-3 md:mb-4">
                  {item.title}
                </h3>
                <p className="text-[#0D1B2A]/70 text-sm md:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#F5F5DC] to-[#FFF8DC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-4 md:mb-6">
              Ce Que Disent Nos Utilisateurs
            </h2>
            <p className="text-lg md:text-xl text-[#0D1B2A]/80 max-w-3xl mx-auto">
              Des témoignages authentiques d'agriculteurs qui ont transformé leur activité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#D4AF37]/20"
              >
                <div className="flex items-center mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#D4AF37] to-[#C1440E] rounded-full flex items-center justify-center text-white font-bold mr-3 md:mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0D1B2A] text-sm md:text-base">{testimonial.name}</h4>
                    <p className="text-[#0D1B2A]/70 text-xs md:text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-3 md:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37] fill-current" />
                  ))}
                </div>
                <p className="text-[#0D1B2A]/80 italic text-sm md:text-base">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-4 md:mb-6">
              Prêt à Transformer Votre Agriculture ?
            </h2>
            <p className="text-lg md:text-xl text-[#0D1B2A]/80 mb-6 md:mb-8">
              Rejoignez des milliers d'agriculteurs qui ont déjà choisi FarmLink
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/register"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#D4AF37] to-[#C1440E] text-white font-semibold rounded-xl hover:from-[#C1440E] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                Commencer Gratuitement
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 border-2 border-[#D4AF37] text-[#D4AF37] font-semibold rounded-xl hover:bg-[#D4AF37] hover:text-white transition-all duration-300 text-sm md:text-base"
              >
                Voir les Tarifs
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}