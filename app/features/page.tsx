"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
import MainNav from "@/components/main-nav"

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
  {
    id: "mobile",
    title: "Application Mobile",
    description: "Accédez à vos données partout",
    icon: Smartphone,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    features: [
      "Application iOS et Android",
      "Synchronisation en temps réel",
      "Mode hors ligne",
      "Notifications push"
    ]
  }
]

const stats = [
  { label: "Agriculteurs connectés", value: "10,000+", icon: Users },
  { label: "Transactions réalisées", value: "50,000+", icon: ShoppingCart },
  { label: "Produits vendus", value: "100,000+", icon: TrendingUp },
  { label: "Pays couverts", value: "15+", icon: Globe }
]

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
    role: "Productrice, Sénégal",
    content: "Le marketplace m'a ouvert de nouveaux marchés pour mes légumes bio.",
    rating: 5,
    avatar: "FD"
  },
  {
    name: "Ibrahim Keita",
    role: "Fermier, Côte d'Ivoire",
    content: "La gestion d'équipe est maintenant un jeu d'enfant avec FarmLink.",
    rating: 5,
    avatar: "IK"
  }
]

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState("farming")

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <MainNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Fonctionnalités
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                FarmLink
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez toutes les fonctionnalités qui font de FarmLink la plateforme 
              de référence pour l'agriculture moderne en Afrique
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nos Fonctionnalités Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une suite complète d'outils pour moderniser votre agriculture
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${feature.bgColor} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Feature Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Pourquoi Choisir FarmLink ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des avantages concrets pour votre activité agricole
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Performance",
                description: "Augmentez vos rendements de 30% en moyenne",
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
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.color} rounded-xl mb-6`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ce Que Disent Nos Utilisateurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des témoignages authentiques d'agriculteurs qui ont transformé leur activité
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Prêt à Transformer Votre Agriculture ?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Rejoignez des milliers d'agriculteurs qui ont déjà choisi FarmLink
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/auth/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Commencer Gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.a>
              <motion.a
                href="/pricing"
                className="inline-flex items-center px-8 py-4 border-2 border-amber-500 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Voir les Tarifs
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
