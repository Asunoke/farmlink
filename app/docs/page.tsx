"use client"

import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Menu, 
  X, 
  BookOpen, 
  Rocket, 
  Zap, 
  HelpCircle, 
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Code,
  Smartphone,
  Globe,
  Shield,
  BarChart3,
  Users,
  Settings,
  ArrowRight,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const sections = [
  { 
    id: "introduction", 
    title: "Introduction", 
    icon: BookOpen,
    description: "Découvrez FarmLink et ses fonctionnalités"
  },
  { 
    id: "getting-started", 
    title: "Démarrage rapide", 
    icon: Rocket,
    description: "Premiers pas sur la plateforme",
    badge: "Nouveau"
  },
  { 
    id: "features", 
    title: "Fonctionnalités", 
    icon: Zap,
    description: "Explorez toutes les capacités"
  },
  { 
    id: "faq", 
    title: "FAQ", 
    icon: HelpCircle,
    description: "Questions fréquemment posées"
  },
  { 
    id: "support", 
    title: "Support", 
    icon: MessageSquare,
    description: "Besoin d'aide ? Contactez-nous"
  },
]

const features = [
  {
    icon: BarChart3,
    title: "Gestion des fermes",
    description: "Organisez et suivez vos exploitations agricoles",
    color: "green"
  },
  {
    icon: Smartphone,
    title: "Application mobile",
    description: "Accédez à vos données depuis n'importe où",
    color: "blue"
  },
  {
    icon: Globe,
    title: "Données météo",
    description: "Informations météorologiques en temps réel",
    color: "purple"
  },
  {
    icon: Users,
    title: "Gestion d'équipe",
    description: "Collaborez avec votre équipe et partenaires",
    color: "orange"
  },
  {
    icon: Shield,
    title: "Sécurité",
    description: "Vos données sont protégées et sécurisées",
    color: "red"
  },
  {
    icon: Settings,
    title: "Personnalisation",
    description: "Adaptez la plateforme à vos besoins",
    color: "indigo"
  }
]

const faqs = [
  {
    question: "Comment créer mon premier compte ?",
    answer: "Rendez-vous sur la page d'inscription, remplissez le formulaire avec vos informations et confirmez votre email. Vous recevrez un lien de confirmation par email."
  },
  {
    question: "Puis-je utiliser FarmLink sur mobile ?",
    answer: "Oui ! FarmLink est entièrement responsive et fonctionne parfaitement sur tous les appareils mobiles. Une application native est également en développement."
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire et respectons les standards de sécurité les plus élevés pour protéger vos informations."
  },
  {
    question: "Comment puis-je ajouter mes fermes ?",
    answer: "Une fois connecté, allez dans la section 'Mes Fermes' et cliquez sur 'Ajouter une ferme'. Vous pourrez ensuite renseigner les détails de votre exploitation."
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer: "Non, tous nos tarifs sont transparents. Vous pouvez consulter nos plans de tarification sur la page dédiée. Aucun frais caché."
  }
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("introduction")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
    setIsMobileMenuOpen(false)
  }

  const getFeatureColor = (color: string) => {
    const colors = {
      green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
    }
    return colors[color as keyof typeof colors] || colors.green
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                FarmLink Docs
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher dans la documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex rounded-xl"
                asChild
              >
                <Link href="/contact">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Support
                </Link>
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden rounded-xl"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block sticky top-24">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Documentation
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                          activeSection === section.id
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{section.title}</span>
                        </div>
                        {section.badge && (
                          <Badge variant="outline" className="text-xs">
                            {section.badge}
                          </Badge>
                        )}
                        <ChevronRight className={`h-4 w-4 transition-transform ${
                          activeSection === section.id ? 'rotate-90' : 'group-hover:translate-x-1'
                        }`} />
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
              <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 shadow-xl">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Documentation
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <nav className="space-y-2">
                      {sections.map((section) => {
                        const Icon = section.icon
                        return (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 flex items-center justify-between ${
                              activeSection === section.id
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="h-4 w-4" />
                              <span className="text-sm font-medium">{section.title}</span>
                            </div>
                            {section.badge && (
                              <Badge variant="outline" className="text-xs">
                                {section.badge}
                              </Badge>
                            )}
                          </button>
                        )
                      })}
                    </nav>
                  </div>
                </div>
              )}
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <div className="space-y-12">
              {/* Introduction */}
              <section data-section="introduction" className="scroll-mt-24">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-8 md:p-12 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                      <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Bienvenue dans FarmLink
                    </h1>
                  </div>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    FarmLink est la plateforme qui révolutionne l'agriculture en Afrique. 
                    Gérez vos fermes, suivez vos cultures, analysez vos données et optimisez 
                    vos rendements avec des outils modernes et intuitifs.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        🎯 Notre mission
                      </h3>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Démocratiser l'accès aux technologies agricoles modernes 
                        pour tous les agriculteurs africains.
                      </p>
                    </div>
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        🌍 Notre vision
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Transformer l'agriculture africaine grâce à l'innovation 
                        technologique et l'analyse de données.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="rounded-xl" asChild>
                      <Link href="/auth/signup">
                        <Rocket className="h-4 w-4 mr-2" />
                        Commencer maintenant
                      </Link>
                    </Button>
                    <Button variant="outline" className="rounded-xl" asChild>
                      <Link href="/pricing">
                        Voir les tarifs
                        <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                    </Button>
                  </div>
                </div>
              </section>

              {/* Getting Started */}
              <section data-section="getting-started" className="scroll-mt-24">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-8 md:p-12 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex items-center space-x-3">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Démarrage rapide
                      </h2>
                      <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        Nouveau
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Suivez ce guide pour configurer votre compte FarmLink et commencer 
                    à gérer vos fermes en quelques minutes.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Créer votre compte
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                          Rendez-vous sur la page d'inscription et remplissez le formulaire 
                          avec vos informations personnelles.
                        </p>
                        <Button size="sm" className="rounded-lg" asChild>
                          <Link href="/auth/signup">
                            S'inscrire maintenant
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
                      </div>
              <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Vérifier votre email
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Consultez votre boîte email et cliquez sur le lien de confirmation 
                          pour activer votre compte.
                        </p>
                      </div>
              </div>

                    <div className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Ajouter votre première ferme
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Une fois connecté, allez dans "Mes Fermes" et ajoutez les détails 
                          de votre exploitation agricole.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features */}
              <section data-section="features" className="scroll-mt-24">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-8 md:p-12 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                      <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Fonctionnalités principales
                    </h2>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Découvrez toutes les fonctionnalités qui font de FarmLink 
                    la plateforme de référence pour l'agriculture moderne en Afrique.
                  </p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                      const Icon = feature.icon
                      return (
                        <div
                          key={feature.title}
                          className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:shadow-lg transition-all duration-200 group"
                        >
                          <div className={`inline-flex p-3 rounded-xl mb-4 ${getFeatureColor(feature.color)}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section data-section="faq" className="scroll-mt-24">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-8 md:p-12 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                      <HelpCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Questions fréquentes
                    </h2>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Trouvez rapidement les réponses aux questions les plus courantes 
                    sur FarmLink et ses fonctionnalités.
                  </p>

                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-start">
                          <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm ml-6">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Support */}
              <section data-section="support" className="scroll-mt-24">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-8 md:p-12 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                      <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Besoin d'aide ?
                    </h2>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Notre équipe de support est là pour vous accompagner. 
                    Contactez-nous par email ou consultez nos ressources d'aide.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <h3 className="font-semibold text-green-800 dark:text-green-200">
                          Support par email
                        </h3>
                      </div>
                      <p className="text-green-700 dark:text-green-300 text-sm mb-4">
                        Envoyez-nous un message et nous vous répondrons dans les 24h.
                      </p>
                      <Button size="sm" className="rounded-lg" asChild>
                        <Link href="/contact">
                          Contacter le support
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>

                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                          Centre d'aide
                        </h3>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                        Consultez nos guides détaillés et tutoriels vidéo.
                      </p>
                      <Button size="sm" variant="outline" className="rounded-lg">
                        Accéder au centre d'aide
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Besoin d'aide ? Contactez le support FarmLink
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <Link 
                href="/contact" 
                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
              >
                support@farmlinkmali.com
              </Link>
              <span className="text-gray-400 hidden sm:block">•</span>
              <Link 
                href="/terms" 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                Conditions d'utilisation
              </Link>
              <span className="text-gray-400 hidden sm:block">•</span>
              <Link 
                href="/privacy" 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}