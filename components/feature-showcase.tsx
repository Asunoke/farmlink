"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Leaf, 
  Calculator, 
  Users, 
  Cloud, 
  TrendingUp, 
  ShoppingCart,
  ArrowRight,
  Play,
  Pause
} from "lucide-react"

const features = [
  {
    id: "planning",
    title: "Planification des Récoltes",
    description: "Visualisez et planifiez vos cycles de culture avec précision",
    icon: Leaf,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    mockup: {
      title: "Tableau de Bord - Planification",
      elements: [
        { type: "chart", label: "Graphique des rendements", position: "top-left" },
        { type: "calendar", label: "Calendrier des récoltes", position: "top-right" },
        { type: "list", label: "Liste des parcelles", position: "bottom" }
      ]
    }
  },
  {
    id: "budget",
    title: "Suivi Budgétaire",
    description: "Contrôlez vos coûts et maximisez vos profits",
    icon: Calculator,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    mockup: {
      title: "Gestion Financière",
      elements: [
        { type: "chart", label: "Évolution des revenus", position: "top-left" },
        { type: "list", label: "Dépenses par catégorie", position: "top-right" },
        { type: "summary", label: "Bilan financier", position: "bottom" }
      ]
    }
  },
  {
    id: "weather",
    title: "Météo Intelligente",
    description: "Anticipez les conditions météorologiques",
    icon: Cloud,
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-50",
    mockup: {
      title: "Prévisions Météo",
      elements: [
        { type: "weather", label: "Conditions actuelles", position: "top-left" },
        { type: "forecast", label: "Prévisions 7 jours", position: "top-right" },
        { type: "alerts", label: "Alertes météo", position: "bottom" }
      ]
    }
  }
]

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const startAnimation = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 3000)
  }

  return (
    <section className="py-24 bg-gradient-to-br from-[#F5F5DC] to-[#FFF8DC]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4 text-[#0D1B2A]">
            {"Découvrez FarmLink en action"}
          </h2>
          <p className="text-xl text-[#0D1B2A]/80 text-pretty max-w-2xl mx-auto">
            {"Voyez comment nos fonctionnalités transforment votre agriculture"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature Selection */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`cursor-pointer transition-all duration-300 ${
                  activeFeature === index ? 'scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ x: 10 }}
              >
                <Card className={`${
                  activeFeature === index 
                    ? 'border-[#006633] shadow-lg' 
                    : 'border-[#D4AF37]/30 hover:border-[#006633]/50'
                } transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#0D1B2A] mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-[#0D1B2A]/70 text-sm">
                          {feature.description}
                        </p>
                      </div>
                      {activeFeature === index && (
                        <Badge className="bg-[#006633] text-white">
                          Actif
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Interactive Mockup */}
          <div className="relative">
            <Card className="bg-white border-2 border-[#D4AF37]/30 shadow-2xl">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-[#006633] to-[#D4AF37] p-4 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">
                      {features[activeFeature].mockup.title}
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={startAnimation}
                    >
                      {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-[#F5F5DC] to-white min-h-[400px] relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      {/* Mockup Elements */}
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className={`p-4 rounded-lg bg-gradient-to-r ${features[activeFeature].color} text-white`}
                          animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 0.5, repeat: isAnimating ? 2 : 0 }}
                        >
                          <div className="h-4 bg-white/30 rounded mb-2"></div>
                          <div className="h-3 bg-white/20 rounded w-3/4"></div>
                        </motion.div>
                        
                        <motion.div
                          className="p-4 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40"
                          animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 0.5, repeat: isAnimating ? 2 : 0, delay: 0.2 }}
                        >
                          <div className="space-y-2">
                            <div className="h-3 bg-[#D4AF37]/60 rounded"></div>
                            <div className="h-3 bg-[#D4AF37]/40 rounded w-2/3"></div>
                            <div className="h-3 bg-[#D4AF37]/30 rounded w-1/2"></div>
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        className="p-4 rounded-lg bg-[#006633]/10 border border-[#006633]/20"
                        animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.5, repeat: isAnimating ? 2 : 0, delay: 0.4 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#006633] rounded-full flex items-center justify-center">
                            {React.createElement(features[activeFeature].icon, { className: "h-4 w-4 text-white" })}
                          </div>
                          <div className="flex-1">
                            <div className="h-3 bg-[#006633]/60 rounded mb-2"></div>
                            <div className="h-2 bg-[#006633]/40 rounded w-1/2"></div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Animated Chart */}
                      <motion.div
                        className="mt-6"
                        animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ duration: 0.5, repeat: isAnimating ? 2 : 0, delay: 0.6 }}
                      >
                        <div className="h-32 bg-gradient-to-t from-[#006633]/20 to-transparent rounded-lg p-4 relative">
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-end space-x-2 h-20">
                              {[40, 60, 45, 80, 70, 90, 85].map((height, index) => (
                                <motion.div
                                  key={index}
                                  className="bg-gradient-to-t from-[#006633] to-[#D4AF37] rounded-t"
                                  style={{ width: '12px', height: `${height}%` }}
                                  animate={isAnimating ? { height: [`${height}%`, `${height + 10}%`, `${height}%`] } : {}}
                                  transition={{ duration: 0.5, repeat: isAnimating ? 2 : 0, delay: index * 0.1 }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Floating Action Button */}
            <motion.div
              className="absolute -bottom-4 -right-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#D4AF37] to-[#C1440E] text-white shadow-lg hover:shadow-xl"
              >
                Essai gratuit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
