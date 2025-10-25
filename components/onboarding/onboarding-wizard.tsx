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
  X
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

  const currentStepData = steps[currentStep]
  const CurrentStepComponent = currentStepData.component
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = async () => {
    setIsLoading(true)
    
    // Marquer l'étape comme complétée
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    
    // Simuler une petite pause pour l'UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete()
    }
    
    setIsLoading(false)
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#006633] to-[#0D1B2A] text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Bienvenue sur FarmLink ! 🌱
              </CardTitle>
              <p className="text-[#F5F5DC] mt-2">
                Suivez ce guide pour découvrir toutes les fonctionnalités
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Étape {currentStep + 1} sur {steps.length}
              </span>
              <span className="text-sm">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 h-[500px]">
            {/* Sidebar avec les étapes */}
            <div className="lg:col-span-1 bg-[#F5F5DC] p-4 border-r">
              <h3 className="font-semibold text-[#0D1B2A] mb-4">Parcours d'apprentissage</h3>
              <div className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = completedSteps.has(index)
                  const isCurrent = index === currentStep
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                        isCurrent 
                          ? 'bg-[#006633] text-white' 
                          : isCompleted 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-white text-[#0D1B2A] hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{step.title}</p>
                        <p className="text-xs opacity-75 truncate">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-3 p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-[#006633]/10 rounded-lg">
                    <currentStepData.icon className="h-6 w-6 text-[#006633]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0D1B2A]">
                      {currentStepData.title}
                    </h2>
                    <p className="text-[#0D1B2A]/70">
                      {currentStepData.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-[300px] overflow-y-auto">
                <CurrentStepComponent 
                  onNext={handleNext}
                  onSkip={handleSkip}
                  isLoading={isLoading}
                />
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-[#0D1B2A]/70 hover:text-[#0D1B2A]"
                  >
                    Passer le tutoriel
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="bg-[#006633] hover:bg-[#C1440E] text-white"
                  >
                    {isLoading ? (
                      "Chargement..."
                    ) : currentStep === steps.length - 1 ? (
                      "Terminer"
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
        </CardContent>
      </Card>
    </div>
  )
}
