"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Users, 
  Mail, 
  ArrowLeft,
  CheckCircle,
  Globe,
  Heart,
  Cookie,
  Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const sections = [
  { id: "introduction", title: "Introduction", icon: Shield },
  { id: "collecte", title: "Collecte des données", icon: Database },
  { id: "utilisation", title: "Utilisation des données", icon: Settings },
  { id: "partage", title: "Partage des données", icon: Users },
  { id: "securite", title: "Sécurité", icon: Lock },
  { id: "droits", title: "Vos droits", icon: CheckCircle },
  { id: "cookies", title: "Cookies", icon: Cookie },
  { id: "contact", title: "Contact", icon: Mail },
]

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("introduction")

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]')
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const element = section as HTMLElement
        const top = element.offsetTop
        const bottom = top + element.offsetHeight

        if (scrollPosition >= top && scrollPosition < bottom) {
          setActiveSection(element.dataset.section || "")
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
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
                <Lock className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Politique de confidentialité
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Transparence et protection de vos données personnelles
              </p>
              <p className="text-sm text-white/70 mt-4">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Table des matières */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Table des matières
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                          activeSection === section.id
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{section.title}</span>
                      </button>
                    )
                  })}
                </nav>
              </motion.div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-8 md:p-12 shadow-xl"
            >
              {/* Introduction */}
              <section data-section="introduction" className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Introduction
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Chez <strong className="text-blue-600 dark:text-blue-400">FarmLink</strong>, 
                    nous prenons la protection de vos données personnelles très au sérieux. 
                    Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mt-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                          Notre engagement
                        </h4>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          Nous nous engageons à respecter votre vie privée et à traiter vos données 
                          avec la plus grande transparence et sécurité, conformément au RGPD.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Collecte des données */}
              <section data-section="collecte" className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Collecte des données
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Types de données collectées
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-green-600" />
                        Données d'identification
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Nom et prénom</li>
                        <li>• Adresse email</li>
                        <li>• Numéro de téléphone</li>
                        <li>• Adresse postale (optionnel)</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Settings className="h-4 w-4 mr-2 text-blue-600" />
                        Données d'utilisation
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Historique de connexion</li>
                        <li>• Préférences de l'application</li>
                        <li>• Données de navigation</li>
                        <li>• Interactions avec le service</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Méthodes de collecte
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-800 dark:text-green-200">
                          Informations fournies directement
                        </h4>
                        <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                          Lors de l'inscription, de la configuration de votre profil ou de l'utilisation des fonctionnalités.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                          Données collectées automatiquement
                        </h4>
                        <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                          Informations techniques, cookies et données d'utilisation pour améliorer le service.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Utilisation des données */}
              <section data-section="utilisation" className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Utilisation des données
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Finalités du traitement
                  </h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                          Fourniture du service
                        </h4>
                        <p className="text-purple-700 dark:text-purple-300 text-sm">
                          Gestion de votre compte, accès aux fonctionnalités et support client.
                        </p>
                      </div>
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                        <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                          Amélioration du service
                        </h4>
                        <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                          Analyse des données d'utilisation pour optimiser l'expérience utilisateur.
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                          Communication
                        </h4>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          Envoi de notifications importantes et mises à jour du service.
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                          Sécurité
                        </h4>
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          Protection contre la fraude et maintien de la sécurité de la plateforme.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Partage des données */}
              <section data-section="partage" className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                    <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Partage des données
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Nous ne vendons jamais vos données personnelles. Nous ne partageons vos informations 
                    qu'avec votre consentement explicite ou dans les cas suivants :
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                          Prestataires de services
                        </h4>
                        <p className="text-orange-700 dark:text-orange-300 text-sm mt-1">
                          Partenaires de confiance qui nous aident à fournir le service (hébergement, analytics).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-200">
                          Obligations légales
                        </h4>
                        <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                          Lorsque requis par la loi ou pour protéger nos droits et ceux de nos utilisateurs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Sécurité */}
              <section data-section="securite" className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sécurité
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Mesures de protection
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                          Chiffrement
                        </h4>
                        <p className="text-red-700 dark:text-red-300 text-sm">
                          Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256).
                        </p>
                      </div>
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                          Authentification
                        </h4>
                        <p className="text-orange-700 dark:text-orange-300 text-sm">
                          Authentification multi-facteurs et mots de passe sécurisés.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                          Surveillance
                        </h4>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          Surveillance continue des accès et détection d'intrusions.
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                          Sauvegarde
                        </h4>
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          Sauvegardes régulières et récupération en cas d'incident.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Vos droits */}
              <section data-section="droits" className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Vos droits
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        Droit d'accès
                      </h4>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Consulter les données que nous détenons sur vous.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Droit de rectification
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Corriger ou mettre à jour vos informations.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                        Droit à l'effacement
                      </h4>
                      <p className="text-purple-700 dark:text-purple-300 text-sm">
                        Demander la suppression de vos données.
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                        Droit à la portabilité
                      </h4>
                      <p className="text-orange-700 dark:text-orange-300 text-sm">
                        Récupérer vos données dans un format structuré.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Cookies */}
              <section data-section="cookies" className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                    <Cookie className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Cookies
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Nous utilisons des cookies pour améliorer votre expérience et analyser l'utilisation de notre service.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        Cookies essentiels
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        Nécessaires au fonctionnement de la plateforme (authentification, sécurité).
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Cookies analytiques
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Pour comprendre comment vous utilisez notre service et l'améliorer.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        Cookies de préférences
                      </h4>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Pour mémoriser vos préférences (thème, langue, paramètres).
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section data-section="contact" className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Contact
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
                    contactez notre délégué à la protection des données.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Délégué à la protection des données
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Pour les questions sur la protection des données
                      </p>
                      <a 
                        href="mailto:dpo@farmlink.africa" 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                       support@farmlinkmali.com
                      </a>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Support général
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Pour toute autre question
                      </p>
                      <a 
                        href="mailto:support@farmlink.africa" 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        support@farmlinkmali.com
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-600 dark:text-gray-300">
                © {new Date().getFullYear()} FarmLink. Fait avec ❤️ en Afrique.
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
