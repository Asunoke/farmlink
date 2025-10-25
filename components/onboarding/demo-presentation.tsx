"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  User, 
  CreditCard,
  ArrowRight,
  CheckCircle,
  Play,
  Pause,
  RotateCcw
} from "lucide-react"

interface DemoPresentationProps {
  stepId: string
  onNext: () => void
}

const demos = {
  farm: {
    title: "Gestion de Fermes",
    description: "Créez et gérez vos fermes facilement",
    steps: [
      {
        title: "Ajouter une ferme",
        description: "Cliquez sur 'Nouvelle ferme' pour commencer",
        action: "Créer une ferme",
        icon: Home
      },
      {
        title: "Remplir les informations",
        description: "Nom, localisation, superficie et culture",
        action: "Saisir les détails",
        icon: CheckCircle
      },
      {
        title: "Ajouter des parcelles",
        description: "Divisez votre ferme en parcelles",
        action: "Créer des parcelles",
        icon: CheckCircle
      }
    ]
  },
  expense: {
    title: "Gestion Financière",
    description: "Suivez vos dépenses et revenus",
    steps: [
      {
        title: "Enregistrer une dépense",
        description: "Cliquez sur 'Nouvelle dépense'",
        action: "Ajouter dépense",
        icon: DollarSign
      },
      {
        title: "Catégoriser",
        description: "Graines, engrais, main d'œuvre...",
        action: "Sélectionner catégorie",
        icon: CheckCircle
      },
      {
        title: "Analyser",
        description: "Voir vos dépenses par catégorie",
        action: "Voir les analyses",
        icon: CheckCircle
      }
    ]
  },
  team: {
    title: "Gestion d'Équipe",
    description: "Organisez votre équipe agricole",
    steps: [
      {
        title: "Ajouter un employé",
        description: "Nom, rôle, salaire et contact",
        action: "Nouvel employé",
        icon: Users
      },
      {
        title: "Créer des tâches",
        description: "Assignez des tâches à vos employés",
        action: "Créer tâche",
        icon: CheckCircle
      },
      {
        title: "Suivre les performances",
        description: "Voir l'avancement des tâches",
        action: "Voir le suivi",
        icon: CheckCircle
      }
    ]
  },
  marketplace: {
    title: "Marché Agricole",
    description: "Vendez et achetez vos produits",
    steps: [
      {
        title: "Créer une offre",
        description: "Vendez vos produits agricoles",
        action: "Nouvelle offre",
        icon: ShoppingCart
      },
      {
        title: "Publier une demande",
        description: "Recherchez des produits spécifiques",
        action: "Nouvelle demande",
        icon: CheckCircle
      },
      {
        title: "Négocier",
        description: "Discutez avec d'autres agriculteurs",
        action: "Ouvrir négociation",
        icon: CheckCircle
      }
    ]
  },
  profile: {
    title: "Profil Utilisateur",
    description: "Complétez votre profil",
    steps: [
      {
        title: "Informations personnelles",
        description: "Nom, téléphone, localisation",
        action: "Modifier profil",
        icon: User
      },
      {
        title: "Spécialisations",
        description: "Vos cultures et expérience",
        action: "Ajouter spécialités",
        icon: CheckCircle
      },
      {
        title: "Préférences",
        description: "Notifications et paramètres",
        action: "Configurer",
        icon: CheckCircle
      }
    ]
  },
  pricing: {
    title: "Choisir son Plan",
    description: "Sélectionnez le plan adapté",
    steps: [
      {
        title: "Comparer les plans",
        description: "Gratuit, Professional, Business, Enterprise",
        action: "Voir les tarifs",
        icon: CreditCard
      },
      {
        title: "Sélectionner",
        description: "Choisissez selon vos besoins",
        action: "Sélectionner plan",
        icon: CheckCircle
      },
      {
        title: "Payer",
        description: "Orange Money, carte bancaire...",
        action: "Procéder au paiement",
        icon: CheckCircle
      }
    ]
  }
}

export function DemoPresentation({ stepId, onNext }: DemoPresentationProps) {
  const [currentDemoStep, setCurrentDemoStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const demo = demos[stepId as keyof typeof demos]
  const currentStep = demo?.steps[currentDemoStep]

  useEffect(() => {
    if (isPlaying && currentDemoStep < demo.steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentDemoStep(prev => prev + 1)
        setCompletedSteps(prev => new Set([...prev, currentDemoStep]))
      }, 2000)
      return () => clearTimeout(timer)
    } else if (isPlaying && currentDemoStep === demo.steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentDemoStep, demo.steps.length])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    setCurrentDemoStep(0)
    setCompletedSteps(new Set())
    setIsPlaying(false)
  }

  if (!demo) return null

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#0D1B2A] mb-2">{demo.title}</h3>
        <p className="text-[#0D1B2A]/70">{demo.description}</p>
      </div>

      {/* Contrôles de démonstration */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={isPlaying ? handlePause : handlePlay}
          className="bg-[#006633] hover:bg-[#C1440E] text-white"
        >
          {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isPlaying ? 'Pause' : 'Démarrer'}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Recommencer
        </Button>
      </div>

      {/* Démonstration visuelle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {demo.steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = completedSteps.has(index)
          const isCurrent = index === currentDemoStep
          const isUpcoming = index > currentDemoStep

          return (
            <Card 
              key={index}
              className={`transition-all duration-500 ${
                isCurrent 
                  ? 'border-[#006633] bg-[#006633]/5 shadow-lg scale-105' 
                  : isCompleted 
                    ? 'border-green-300 bg-green-50' 
                    : isUpcoming 
                      ? 'border-gray-200 bg-gray-50 opacity-60' 
                      : 'border-[#D4AF37]/30'
              }`}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  isCurrent 
                    ? 'bg-[#006633] text-white' 
                    : isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-[#0D1B2A] mb-2">{step.title}</h4>
                <p className="text-sm text-[#0D1B2A]/70 mb-3">{step.description}</p>
                <Badge 
                  variant="outline" 
                  className={`${
                    isCurrent 
                      ? 'border-[#006633] text-[#006633]' 
                      : isCompleted 
                        ? 'border-green-500 text-green-600' 
                        : 'border-gray-300 text-gray-500'
                  }`}
                >
                  {step.action}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Progression */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          {demo.steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index <= currentDemoStep 
                  ? 'bg-[#006633]' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-[#0D1B2A]/70">
          Étape {currentDemoStep + 1} sur {demo.steps.length}
        </p>
      </div>

      {/* Bouton continuer */}
      <div className="text-center">
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-[#006633] to-[#0D1B2A] hover:from-[#C1440E] hover:to-[#006633] text-white px-8 py-3 text-lg font-semibold"
        >
          Continuer
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
