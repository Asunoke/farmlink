"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown } from "lucide-react"
import Link from "next/link"

interface PricingStepProps {
  onNext: () => void
  onSkip: () => void
  isLoading: boolean
}

const plans = [
  {
    id: "FREE",
    name: "Starter",
    price: "Gratuit",
    description: "Pour commencer",
    features: [
      "Jusqu'à 1 ferme",
      "Suivi budgétaire de base",
      "Météo en temps réel",
      "Support communautaire"
    ],
    icon: Star,
    color: "border-gray-300",
    buttonColor: "bg-gray-500 hover:bg-gray-600"
  },
  {
    id: "BASIC",
    name: "Professional",
    price: "35,000 FCFA/mois",
    description: "Pour les exploitations moyennes",
    features: [
      "Jusqu'à 3 fermes",
      "Gestion d'équipe complète",
      "Analyses avancées",
      "Support prioritaire",
      "Marché agricole"
    ],
    icon: Zap,
    color: "border-[#006633]",
    buttonColor: "bg-[#006633] hover:bg-[#C1440E]",
    popular: true
  },
  {
    id: "PREMIUM",
    name: "Enterprise",
    price: "75,000 FCFA/mois",
    description: "Pour les grandes exploitations",
    features: [
      "Jusqu'à 5 fermes",
      "API personnalisée",
      "Formation sur site",
      "Support dédié 24/7",
      "Analytics avancés"
    ],
    icon: Crown,
    color: "border-[#C1440E]",
    buttonColor: "bg-[#C1440E] hover:bg-[#006633]"
  }
]

export function PricingStep({ onNext, onSkip, isLoading }: PricingStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleContinue = async () => {
    if (selectedPlan) {
      // Rediriger vers la page de paiement ou continuer
      if (selectedPlan === "FREE") {
        onNext()
      } else {
        // Rediriger vers la page de paiement
        window.location.href = `/pricing/payment?plan=${selectedPlan}`
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#006633]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="h-8 w-8 text-[#006633]" />
        </div>
        <h3 className="text-lg font-semibold text-[#0D1B2A] mb-2">
          Choisissez votre plan
        </h3>
        <p className="text-[#0D1B2A]/70 text-sm">
          Sélectionnez le plan qui correspond le mieux à vos besoins agricoles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isSelected = selectedPlan === plan.id
          
          return (
            <Card 
              key={plan.id}
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? `${plan.color} border-2 bg-[#006633]/5` 
                  : `${plan.color} hover:border-[#006633]/50`
              } ${plan.popular ? 'ring-2 ring-[#006633]/20' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#006633] text-white">Populaire</Badge>
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-[#006633]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-[#006633]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0D1B2A]">{plan.name}</h3>
                  <p className="text-sm text-[#0D1B2A]/70 mb-2">{plan.description}</p>
                  <div className="text-2xl font-bold text-[#006633]">{plan.price}</div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-[#0D1B2A]/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.buttonColor} text-white`}
                  variant={isSelected ? "default" : "outline"}
                >
                  {isSelected ? "Sélectionné" : "Sélectionner"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-[#F5F5DC] border-[#D4AF37]/30">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#006633]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="h-4 w-4 text-[#006633]" />
            </div>
            <div>
              <h4 className="font-medium text-[#0D1B2A] mb-1">
                💡 Conseil
              </h4>
              <p className="text-sm text-[#0D1B2A]/70">
                Commencez avec le plan Starter gratuit pour découvrir FarmLink. 
                Vous pourrez toujours mettre à niveau plus tard selon vos besoins.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
        >
          Passer cette étape
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedPlan || isLoading}
          className="bg-[#006633] hover:bg-[#C1440E] text-white"
        >
          {isLoading ? "Chargement..." : "Continuer"}
        </Button>
      </div>
    </div>
  )
}
