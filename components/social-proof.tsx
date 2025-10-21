"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Play, 
  Star, 
  Users, 
  TrendingUp, 
  Award,
  CheckCircle,
  Quote
} from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Amadou Traoré",
    role: "Agriculteur, Sikasso",
    image: "AT",
    rating: 5,
    content: "FarmLink m'a permis d'augmenter mes rendements de riz de 40% en une seule saison. La gestion des parcelles et les prévisions météo sont révolutionnaires !",
    result: "+40% de rendement",
    verified: true
  },
  {
    id: 2,
    name: "Fatou Diallo",
    role: "Productrice, Bamako",
    image: "FD",
    rating: 5,
    content: "Le marketplace m'a ouvert de nouveaux marchés. J'ai vendu mes légumes bio à 3x le prix habituel grâce aux connexions avec les acheteurs urbains.",
    result: "+200% de revenus",
    verified: true
  },
  {
    id: 3,
    name: "Ibrahim Keita",
    role: "Fermier, Ségou",
    image: "IK",
    rating: 5,
    content: "La gestion d'équipe est maintenant un jeu d'enfant. Mes 15 employés sont plus productifs et je gagne 2h par jour sur l'organisation.",
    result: "+2h/jour gagnées",
    verified: true
  }
]

const achievements = [
  {
    icon: Users,
    number: "500+",
    label: "Agriculteurs connectés",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: TrendingUp,
    number: "40%",
    label: "Augmentation moyenne des rendements",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: Award,
    number: "30%",
    label: "Réduction des coûts",
    color: "from-orange-500 to-amber-600"
  },
  {
    icon: Star,
    number: "4.9/5",
    label: "Note moyenne des utilisateurs",
    color: "from-purple-500 to-violet-600"
  }
]

export function SocialProof() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  return (
    <section className="py-24 bg-gradient-to-br from-[#F5F5DC] to-[#FFF8DC]">
      <div className="container mx-auto px-4">
        {/* Achievements */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-[#0D1B2A] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {"Rejoignez une communauté qui grandit"}
          </motion.h2>
          <motion.p
            className="text-xl text-[#0D1B2A]/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {"Des résultats concrets pour des agriculteurs réels"}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-white/50 rounded-xl border border-[#D4AF37]/20 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-full mb-4`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <achievement.icon className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                className="text-3xl font-bold text-[#0D1B2A] mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {achievement.number}
              </motion.div>
              <div className="text-sm text-[#0D1B2A]/70">{achievement.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl lg:text-3xl font-bold text-[#0D1B2A] mb-4">
              {"Ce que disent nos utilisateurs"}
            </h3>
            <p className="text-lg text-[#0D1B2A]/80">
              {"Des témoignages authentiques d'agriculteurs qui ont transformé leur activité"}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-white border-[#D4AF37]/30 hover:border-[#006633] hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Quote Icon */}
                    <motion.div
                      className="text-[#D4AF37] mb-4"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Quote className="w-8 h-8" />
                    </motion.div>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.2, delay: 0.3 + i * 0.1 }}
                        >
                          <Star className="w-4 h-4 text-[#D4AF37] fill-current" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-[#0D1B2A]/80 italic mb-6 flex-1">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#006633] to-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.image}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-bold text-[#0D1B2A]">{testimonial.name}</h4>
                          {testimonial.verified && (
                            <CheckCircle className="w-4 h-4 text-[#006633] ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-[#0D1B2A]/70">{testimonial.role}</p>
                      </div>
                    </div>

                    {/* Result Badge */}
                    <motion.div
                      className="mt-auto"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <Badge className="bg-gradient-to-r from-[#006633] to-[#D4AF37] text-white">
                        {testimonial.result}
                      </Badge>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap justify-center items-center gap-8 text-[#0D1B2A]/60">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-[#006633] mr-2" />
                <span className="text-sm font-medium">Données sécurisées</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-[#006633] mr-2" />
                <span className="text-sm font-medium">Support 24/7</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-[#006633] mr-2" />
                <span className="text-sm font-medium">Formation gratuite</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-[#006633] mr-2" />
                <span className="text-sm font-medium">Essai gratuit 30 jours</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
