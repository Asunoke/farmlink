"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Home, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  User,
  X,
  Sparkles,
  Play,
  SkipForward,
  ExternalLink
} from "lucide-react"

interface SimpleTutorialProps {
  onComplete: () => void
  onSkip: () => void
}

const tutorialSteps = [
  {
    id: "welcome",
    title: "Bienvenue sur FarmLink !",
    description: "Découvrez comment transformer votre agriculture avec notre guide interactif",
    icon: Sparkles,
    action: "Commencer la visite",
    redirect: null
  },
  {
    id: "farms",
    title: "Gérer vos fermes",
    description: "Créez et gérez vos fermes, ajoutez des parcelles et suivez vos cultures",
    icon: Home,
    action: "Voir les fermes",
    redirect: "/dashboard/farms"
  },
  {
    id: "finances",
    title: "Suivre vos finances",
    description: "Enregistrez vos dépenses, revenus et analysez votre rentabilité",
    icon: DollarSign,
    action: "Gérer les finances",
    redirect: "/dashboard/expenses"
  },
  {
    id: "team",
    title: "Organiser votre équipe",
    description: "Ajoutez vos employés, assignez des tâches et suivez leur productivité",
    icon: Users,
    action: "Gérer l'équipe",
    redirect: "/dashboard/team"
  },
  {
    id: "marketplace",
    title: "Explorer le marché",
    description: "Vendez vos produits et achetez des intrants sur notre marché agricole",
    icon: ShoppingCart,
    action: "Découvrir le marché",
    redirect: "/dashboard/marketplace"
  },
  {
    id: "profile",
    title: "Compléter votre profil",
    description: "Finalisez vos informations et gérez votre abonnement",
    icon: User,
    action: "Compléter le profil",
    redirect: "/dashboard/profile"
  }
]

export function SimpleTutorial({ onComplete, onSkip }: SimpleTutorialProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  const currentStepData = tutorialSteps[currentStep]
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100

  const handleNext = async () => {
    setIsTransitioning(true)
    
    // Marquer l'étape comme complétée
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    
    // Animation de transition
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete()
    }
    
    setIsTransitioning(false)
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(prev => prev - 1)
        setIsTransitioning(false)
      }, 200)
    }
  }

  const handleStartTutorial = () => {
    setShowWelcome(false)
  }

  const handleSkip = () => {
    onSkip()
  }

  const handleAction = () => {
    if (currentStepData.redirect) {
      // Ouvrir la page dans un nouvel onglet
      window.open(currentStepData.redirect, '_blank')
    }
    handleNext()
  }

  // Page d'accueil du tutoriel
  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden border-0 shadow-2xl">
          <CardHeader className="bg-gradient-to-br from-[#006633] via-[#0D1B2A] to-[#006633] text-white text-center py-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <Sparkles className="h-10 w-10 text-[#D4AF37]" />
            </div>
            <CardTitle className="text-4xl font-bold mb-4">
              Bienvenue sur FarmLink ! 🌱
            </CardTitle>
            <p className="text-xl text-[#F5F5DC]/90 mb-8">
              Découvrez comment transformer votre agriculture avec notre guide interactif
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleStartTutorial}
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#C1440E] text-[#0D1B2A] font-semibold px-8 py-4 text-lg touch-manipulation min-h-[44px]"
              >
                <Play className="h-5 w-5 mr-2" />
                Commencer la visite
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg touch-manipulation min-h-[44px]"
              >
                <SkipForward className="h-5 w-5 mr-2" />
                Passer le tutoriel
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4" style={{ touchAction: 'manipulation' }}>
      <Card className={`w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border-0 shadow-2xl transition-all duration-500 ${
        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        <CardHeader className="bg-gradient-to-r from-[#006633] to-[#0D1B2A] text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-[#D4AF37]" />
                Guide FarmLink
              </CardTitle>
              <p className="text-[#F5F5DC] mt-2">
                Étape {currentStep + 1} sur {tutorialSteps.length} • {currentStepData.title}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-white hover:bg-white/20 transition-colors touch-manipulation min-h-[44px] min-w-[44px]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Progression
              </span>
              <span className="text-sm">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </CardHeader>

        <CardContent className="p-6 bg-gradient-to-br from-white to-[#F5F5DC]/30">
          <div className={`transition-all duration-500 ${
            isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
          }`}>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-[#006633] to-[#0D1B2A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <currentStepData.icon className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                {currentStepData.title}
              </h2>
              <p className="text-[#0D1B2A]/80 text-lg leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {currentStepData.redirect && (
              <div className="bg-[#006633]/10 border border-[#006633]/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5 text-[#006633]" />
                  <div>
                    <p className="text-sm font-medium text-[#0D1B2A]">
                      Cette fonctionnalité s'ouvrira dans un nouvel onglet
                    </p>
                    <p className="text-xs text-[#0D1B2A]/70">
                      Vous pourrez revenir ici pour continuer le guide
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A] transition-all duration-300 disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-[#0D1B2A]/70 hover:text-[#0D1B2A] hover:bg-[#D4AF37]/10 transition-all duration-300 w-full sm:w-auto touch-manipulation min-h-[44px]"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Passer le guide
                </Button>
                <Button
                  onClick={currentStepData.redirect ? handleAction : handleNext}
                  className="bg-gradient-to-r from-[#006633] to-[#0D1B2A] hover:from-[#C1440E] hover:to-[#006633] text-white px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto touch-manipulation min-h-[44px]"
                >
                  {currentStep === tutorialSteps.length - 1 ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Terminer
                    </>
                  ) : (
                    <>
                      {currentStepData.action}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
