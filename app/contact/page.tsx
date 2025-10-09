"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  ArrowLeft,
  MessageSquare,
  Clock,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simuler l'envoi du formulaire
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0D1B2A]">
        <MainNav />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-[#0B1623] border border-[#D4AF37]/20 rounded-2xl p-12 shadow-xl"
            >
              <div className="w-16 h-16 bg-[#006633]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="h-8 w-8 text-[#006633]" />
              </div>
              <h1 className="text-3xl font-bold text-[#D4AF37] mb-4">
                Message envoyé !
              </h1>
              <p className="text-[#F5F5DC]/70 mb-8">
                Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button className="w-full sm:w-auto bg-[#006633] hover:bg-[#C1440E] text-white">
                    Retour à l'accueil
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full sm:w-auto border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                >
                  Envoyer un autre message
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      <MainNav />
      
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#006633] via-[#D4AF37] to-[#C1440E]" />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <Link href="/">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à l'accueil
                </Button>
              </Link>
              <ThemeToggle />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Contactez-nous
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Nous sommes là pour vous accompagner dans votre aventure agricole
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-[#0B1623] border border-[#D4AF37]/20 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">
                Informations de contact
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#006633]/20 rounded-xl">
                    <Mail className="h-6 w-6 text-[#006633]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F5F5DC] mb-1">
                      Email
                    </h3>
                    <p className="text-[#F5F5DC]/70 mb-2">
                      Pour toute question générale
                    </p>
                    <a 
                      href="mailto:contact@farmlink.africa" 
                      className="text-[#006633] hover:text-[#C1440E] font-medium"
                    >
                      contact@farmlink.africa
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#D4AF37]/20 rounded-xl">
                    <Phone className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F5F5DC] mb-1">
                      Téléphone
                    </h3>
                    <p className="text-[#F5F5DC]/70 mb-2">
                      Support technique et commercial
                    </p>
                    <a 
                      href="tel:+223851234567" 
                      className="text-[#D4AF37] hover:text-[#C1440E] font-medium"
                    >
                      +223 85 23 92 19
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#C1440E]/20 rounded-xl">
                    <MapPin className="h-6 w-6 text-[#C1440E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F5F5DC] mb-1">
                      Adresse
                    </h3>
                    <p className="text-[#F5F5DC]/70 mb-2">
                      Siège social
                    </p>
                    <p className="text-[#C1440E] font-medium">
                      Bamako, Mali<br />
                      ACI 2000, Rue 123
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#F5F5DC]/20 rounded-xl">
                    <Clock className="h-6 w-6 text-[#F5F5DC]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F5F5DC] mb-1">
                      Horaires
                    </h3>
                    <p className="text-[#F5F5DC]/70 mb-2">
                      Support disponible
                    </p>
                    <p className="text-[#F5F5DC] font-medium">
                      Lundi - Vendredi : 8h - 18h<br />
                      Samedi : 9h - 15h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0B1623] border border-[#D4AF37]/20 rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
                Pourquoi nous contacter ?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#006633] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-[#F5F5DC]/70 text-sm">
                    Questions sur l'utilisation de la plateforme
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#006633] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-[#F5F5DC]/70 text-sm">
                    Support technique et résolution de problèmes
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#006633] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-[#F5F5DC]/70 text-sm">
                    Suggestions d'amélioration
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#006633] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-[#F5F5DC]/70 text-sm">
                    Partenariats et collaborations
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-[#0B1623] border border-[#D4AF37]/20 rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">
              Envoyez-nous un message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#F5F5DC]">
                    Nom complet *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#F5F5DC]">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-[#F5F5DC]">
                  Sujet *
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                  placeholder="Objet de votre message"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#F5F5DC]">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="rounded-xl bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37] resize-none"
                  placeholder="Décrivez votre question ou votre demande..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-[#006633] hover:bg-[#C1440E] text-white font-medium transition-all duration-200 hover:scale-105"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Envoi en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Envoyer le message</span>
                  </div>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
