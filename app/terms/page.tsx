"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  FileText, 
  Eye, 
  Lock, 
  Users, 
  AlertTriangle, 
  Mail, 
  ArrowLeft,
  CheckCircle,
  Globe,
  Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const sections = [
  { id: "introduction", title: "Introduction", icon: FileText },
  { id: "utilisation", title: "Utilisation du service", icon: Globe },
  { id: "donnees", title: "Données personnelles", icon: Lock },
  { id: "responsabilite", title: "Responsabilité", icon: Shield },
  { id: "modifications", title: "Modifications", icon: AlertTriangle },
  { id: "contact", title: "Contact", icon: Mail },
]

export default function TermsPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500" />
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
                <Shield className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Conditions d'utilisation
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Politique de confidentialité et engagement de transparence
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
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
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
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Introduction
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Bienvenue sur <strong className="text-green-600 dark:text-green-400">FarmLink</strong>, 
                    la plateforme qui révolutionne l'agriculture en Afrique. Ces conditions d'utilisation 
                    définissent notre engagement envers la transparence, la sécurité et l'innovation.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mt-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                          Notre engagement
                        </h4>
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          Nous nous engageons à protéger vos données, respecter votre vie privée 
                          et fournir un service de qualité pour transformer l'agriculture africaine.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Utilisation du service */}
              <section data-section="utilisation" className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Utilisation du service
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Utilisations autorisées
                  </h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Gestion de vos exploitations agricoles et parcelles</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Suivi des dépenses et revenus de votre activité</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Accès aux données météorologiques et conseils agricoles</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Collaboration avec votre équipe et partenaires</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
                    Utilisations interdites
                  </h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Utilisation à des fins illégales ou malveillantes</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Tentative de piratage ou d'accès non autorisé</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Partage de votre compte avec des tiers</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Données personnelles */}
              <section data-section="donnees" className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Données personnelles
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Collecte des données
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Nous collectons uniquement les données nécessaires pour fournir nos services :
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Données d'identification
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Nom et prénom</li>
                        <li>• Adresse email</li>
                        <li>• Numéro de téléphone (optionnel)</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Données d'activité
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        <li>• Informations sur vos fermes</li>
                        <li>• Données financières</li>
                        <li>• Préférences d'utilisation</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Protection et sécurité
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                          Chiffrement et sécurité
                        </h4>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          Toutes vos données sont chiffrées en transit et au repos. Nous utilisons 
                          les standards de sécurité les plus élevés pour protéger vos informations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Responsabilité */}
              <section data-section="responsabilite" className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                    <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Responsabilité
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Nos garanties
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-800 dark:text-green-200">
                          Disponibilité du service
                        </h4>
                        <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                          Nous nous efforçons de maintenir une disponibilité de 99.9% de notre service.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                          Support client
                        </h4>
                        <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                          Notre équipe est disponible pour vous accompagner dans l'utilisation de la plateforme.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
                    Limitation de responsabilité
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    FarmLink ne peut être tenu responsable des dommages indirects résultant de 
                    l'utilisation de la plateforme. Nous recommandons de toujours vérifier 
                    les informations météorologiques et agricoles auprès de sources officielles.
                  </p>
                </div>
              </section>

              {/* Modifications */}
              <section data-section="modifications" className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Modifications
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Nous nous réservons le droit de modifier ces conditions d'utilisation 
                    pour améliorer nos services ou nous conformer aux réglementations.
                  </p>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                          Notification des changements
                        </h4>
                        <p className="text-amber-700 dark:text-amber-300 text-sm">
                          Vous serez notifié par email 30 jours avant l'entrée en vigueur 
                          de toute modification importante de ces conditions.
                        </p>
                      </div>
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
                    Pour toute question concernant ces conditions d'utilisation ou notre 
                    politique de confidentialité, n'hésitez pas à nous contacter.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Support technique
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Pour les questions techniques et l'assistance
                      </p>
                      <a 
                        href="mailto:support@farmlink.africa" 
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                      >
                        support@farmlink.africa
                      </a>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Questions légales
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Pour les questions sur les conditions d'utilisation
                      </p>
                      <a 
                        href="mailto:legal@farmlink.africa" 
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                      >
                        legal@farmlink.africa
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
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-gray-600 dark:text-gray-300">
                © {new Date().getFullYear()} FarmLink. Fait avec ❤️ en Afrique.
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/privacy" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/contact" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}