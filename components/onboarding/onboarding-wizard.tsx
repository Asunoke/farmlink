"use client"

import { useState, useEffect } from "react"
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
  CreditCard,
  X,
  Sparkles,
  Play,
  SkipForward
} from "lucide-react"
import { FarmStep } from "./steps/farm-step"
import { ExpenseStep } from "./steps/expense-step"
import { TeamStep } from "./steps/team-step"
import { MarketplaceStep } from "./steps/marketplace-step"
import { ProfileStep } from "./steps/profile-step"
import { PricingStep } from "./steps/pricing-step"

interface OnboardingWizardProps {
  onComplete: () => void
  onSkip: () => void
}

const steps = [
  {
    id: "farm",
    title: "Créer votre première ferme",
    description: "Ajoutez votre ferme et commencez à suivre vos parcelles",
    icon: Home,
    component: FarmStep
  },
  {
    id: "expense",
    title: "Gérer vos finances",
    description: "Enregistrez vos premières dépenses et revenus",
    icon: DollarSign,
    component: ExpenseStep
  },
  {
    id: "team",
    title: "Organiser votre équipe",
    description: "Ajoutez vos employés et planifiez leurs tâches",
    icon: Users,
    component: TeamStep
  },
  {
    id: "marketplace",
    title: "Explorer le marché",
    description: "Découvrez le marché agricole et créez vos offres",
    icon: ShoppingCart,
    component: MarketplaceStep
  },
  {
    id: "profile",
    title: "Compléter votre profil",
    description: "Finalisez vos informations personnelles",
    icon: User,
    component: ProfileStep
  },
  {
    id: "pricing",
    title: "Choisir votre plan",
    description: "Sélectionnez le plan qui correspond à vos besoins",
    icon: CreditCard,
    component: PricingStep
  }
]

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  const currentStepData = steps[currentStep]
  const CurrentStepComponent = currentStepData.component
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = async () => {
    setIsLoading(true)
    setIsTransitioning(true)
    
    // Marquer l'étape comme complétée
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    
    // Animation de transition
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete()
    }
    
    setIsLoading(false)
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
                className="bg-[#D4AF37] hover:bg-[#C1440E] text-[#0D1B2A] font-semibold px-8 py-4 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Commencer le tutoriel
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-5xl max-h-[90vh] overflow-hidden border-0 shadow-2xl transition-all duration-500 ${
        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        <CardHeader className="bg-gradient-to-r from-[#006633] to-[#0D1B2A] text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-[#D4AF37]" />
                Tutoriel FarmLink
              </CardTitle>
              <p className="text-[#F5F5DC] mt-2">
                Étape {currentStep + 1} sur {steps.length} • {currentStepData.title}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-white hover:bg-white/20 transition-colors"
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

        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 h-[600px]">
            {/* Sidebar avec les étapes */}
            <div className="lg:col-span-1 bg-gradient-to-b from-[#F5F5DC] to-[#FFF8DC] p-6 border-r border-[#D4AF37]/20">
              <h3 className="font-bold text-[#0D1B2A] mb-6 text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#006633]" />
                Parcours d'apprentissage
              </h3>
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = completedSteps.has(index)
                  const isCurrent = index === currentStep
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                        isCurrent 
                          ? 'bg-gradient-to-r from-[#006633] to-[#0D1B2A] text-white shadow-lg scale-105' 
                          : isCompleted 
                            ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200' 
                            : 'bg-white text-[#0D1B2A] hover:bg-[#006633]/5 hover:border-[#006633]/20 border border-transparent'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isCurrent ? 'bg-white/20' : 'bg-[#006633]/10'
                          }`}>
                            <Icon className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{step.title}</p>
                        <p className="text-xs opacity-75 truncate">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-3 p-8 bg-gradient-to-br from-white to-[#F5F5DC]/30">
              <div className={`transition-all duration-500 ${
                isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
              }`}>
                <div className="mb-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-gradient-to-r from-[#006633] to-[#0D1B2A] rounded-xl shadow-lg">
                      <currentStepData.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#0D1B2A] mb-2">
                        {currentStepData.title}
                      </h2>
                      <p className="text-[#0D1B2A]/80 text-lg">
                        {currentStepData.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#D4AF37] scrollbar-track-transparent">
                  <CurrentStepComponent 
                    onNext={handleNext}
                    onSkip={handleSkip}
                    isLoading={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#D4AF37]/20">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A] transition-all duration-300 disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Précédent
                  </Button>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      onClick={handleSkip}
                      className="text-[#0D1B2A]/70 hover:text-[#0D1B2A] hover:bg-[#D4AF37]/10 transition-all duration-300"
                    >
                      <SkipForward className="h-4 w-4 mr-2" />
                      Passer le tutoriel
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-[#006633] to-[#0D1B2A] hover:from-[#C1440E] hover:to-[#006633] text-white px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Chargement...
                        </div>
                      ) : currentStep === steps.length - 1 ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Terminer
                        </>
                      ) : (
                        <>
                          Suivant
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
